import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordCloud } from "./WordCloud";
import { SubPlanHistory } from "./SubPlanHistory";
import { SubPlanWizard } from "./SubPlanWizard";
import { SubPlanHistoryModal } from "./SubPlanHistoryModal";
import { GraduationCap, List, Clock } from "lucide-react";
import { Plus } from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

// Definição da interface do banco de dados
interface SubPlan {
  id: string;
  name: string;
  status: string;
  lastModified?: string;
  topic: string;
  changes?: number;
  mastery: number;
  selectedDays?: string[];
  selectedStrategies?: string[];
  customStrategies?: any;
  hoursPerDay?: number;
  createdAt?: string;
}

// Interface para o componente SubPlanHistory
interface HistorySubPlan {
  id: string;
  name: string;
  status: "active" | "completed";
  lastModified: string;
  topic: string;
  changes: number;
  mastery?: number;
}

interface SummaryCardProps {
  generalPlan: {
    name: string;
    course: string;
    grade: string;
  };
  subPlans: {
    total: number;
    active: number;
    completed: number;
  };
  weeklyHours: number;
  onNewSubPlan: () => void;
}

export function StudyDashboard() {
  const [subPlans, setSubPlans] = useState<SubPlan[]>([]);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubPlan | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [isLoading, setIsLoading] = useState(false);

  const { data: sessionData, status: sessionStatus } = useSession();

  // Consulta tRPC
  const createSubPlanMutation = api.subplanRouter.create.useMutation({
    onSuccess: (data) => {
      console.log(
        "[CLIENT] StudyDashboard - SubPlan criado com sucesso:",
        data
      );
      toast.success("SubPlan criado com sucesso!");
      refetchStudyPlans();
    },
    onError: (error) => {
      console.error("[CLIENT] StudyDashboard - Erro ao criar subplan:", error);
      toast.error(`Erro ao criar subplan: ${error.message}`);
      setIsLoading(false);
    },
  });

  // Função para buscar os subplans do usuário atual
  const { refetch: refetchStudyPlans } = api.subplanRouter.getAll.useQuery(
    undefined,
    {
      enabled: sessionStatus === "authenticated",
      onSuccess: (data) => {
        // Converter os dados do banco para o formato local
        const formattedPlans = data.map((plan) => ({
          id: plan.id,
          name: plan.name,
          topic: plan.topic,
          status: plan.status === "Active" ? "active" : "completed",
          mastery: plan.mastery,
          lastModified: plan.updatedAt
            ? new Date(plan.updatedAt).toLocaleDateString()
            : new Date().toLocaleDateString(),
          changes: 0,
          selectedDays: plan.selectedDays,
          selectedStrategies: plan.selectedStrategies,
          customStrategies: plan.customStrategies,
          hoursPerDay: plan.hoursPerDay,
          createdAt: plan.createdAt
            ? new Date(plan.createdAt).toISOString()
            : undefined,
        }));
        setSubPlans(formattedPlans);
        console.log(
          "[CLIENT] StudyDashboard - SubPlans carregados:",
          formattedPlans.length
        );
      },
    }
  );

  const summaryData: SummaryCardProps = {
    generalPlan: {
      name: "My Study Plan",
      course: "Not set",
      grade: "Not set",
    },
    subPlans: {
      total: subPlans.length,
      active: subPlans.filter((s) => s.status === "active").length,
      completed: subPlans.filter((s) => s.status === "completed").length,
    },
    weeklyHours: 0,
    onNewSubPlan: () => setWizardOpen(true),
  };

  function handleCreateSubPlan(data: any) {
    console.log("[CLIENT] StudyDashboard - Recebendo dados do wizard:", data);

    if (!sessionData?.user) {
      toast.error("You need to be logged in to create a subplan");
      return;
    }

    try {
      setIsLoading(true);

      const subPlanData = {
        name: data.topic,
        topic: data.topic,
        mastery: data.mastery || 0,
        selectedDays: Array.isArray(data.selectedDays) ? data.selectedDays : [],
        selectedStrategies: Array.isArray(data.selectedStrategies)
          ? data.selectedStrategies
          : [],
        customStrategies: data.customStrategies || undefined,
        hoursPerDay: data.hoursPerDay || 2,
        status: "Active",
      };

      // Salvar no banco
      console.log("[CLIENT] StudyDashboard - Salvando no banco:", subPlanData);
      createSubPlanMutation.mutate(subPlanData);

      toast.success("Creating your subplan...");
    } catch (error) {
      console.error("[CLIENT] StudyDashboard - Erro:", error);
      toast.error("Error creating subplan");
      setIsLoading(false);
    }

    setWizardOpen(false);
  }

  // Converter SubPlan para HistorySubPlan para componente local
  const getHistoryPlans = (): HistorySubPlan[] => {
    return subPlans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      status:
        plan.status === "Active"
          ? "active"
          : ((plan.status === "active" ? "active" : "completed") as
              | "active"
              | "completed"),
      lastModified: plan.lastModified || new Date().toLocaleDateString(),
      topic: plan.topic,
      changes: plan.changes || 0,
      mastery: plan.mastery,
    }));
  };

  function handleViewHistory(plan: HistorySubPlan) {
    // Converter de volta para o tipo SubPlan local
    const selectedSubPlan: SubPlan = {
      id: plan.id,
      name: plan.name,
      status: plan.status,
      lastModified: plan.lastModified,
      topic: plan.topic,
      changes: plan.changes,
      mastery: plan.mastery || 0,
    };

    setSelectedPlan(selectedSubPlan);
    setHistoryModalOpen(true);
  }

  return (
    <div
      className="min-h-screen overflow-y-auto bg-white px-12 py-10"
      style={{ maxHeight: "100vh" }}
    >
      {/* Wizard de novo sub-plano */}
      <SubPlanWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={handleCreateSubPlan}
      />

      {/* Modal de histórico detalhado */}
      {selectedPlan && (
        <SubPlanHistoryModal
          open={historyModalOpen}
          onClose={() => setHistoryModalOpen(false)}
          onViewDetails={() => alert("View Plan Details clicked!")}
          title={`${selectedPlan.name} - Modification History`}
          subtitle="Detailed log of all changes made to this sub-plan"
          events={[]}
        />
      )}

      {/* Título e subtítulo */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Study Dashboard</h1>
        <p className="mt-2 text-lg text-gray-500">
          Manage your study plans and track your progress.
        </p>
      </div>

      {/* Botões no topo alinhados à direita */}
      <div className="mb-4 flex justify-end gap-4">
        <Button onClick={() => setWizardOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Sub-Plan
        </Button>
      </div>

      {/* Grid de cards de resumo */}
      <div className="mb-6 grid w-full grid-cols-3 gap-6">
        <div className="min-w-[220px] rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-1 flex items-center justify-between text-sm text-gray-500">
            <span>General Plan</span>
            <GraduationCap className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold">
            {summaryData.generalPlan.name}
          </div>
          <div className="mt-1 text-base text-gray-400">
            {summaryData.generalPlan.course} • {summaryData.generalPlan.grade}
          </div>
        </div>
        <div className="min-w-[220px] rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-1 flex items-center justify-between text-sm text-gray-500">
            <span>Sub-Plans</span>
            <List className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold">{summaryData.subPlans.total}</div>
          <div className="mt-1 text-base">
            <span className="font-semibold text-blue-600">
              ● Active: {summaryData.subPlans.active}
            </span>
            <span className="ml-4 text-gray-400">
              ● Completed: {summaryData.subPlans.completed}
            </span>
          </div>
        </div>
        <div className="min-w-[220px] rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-1 flex items-center justify-between text-sm text-gray-500">
            <span>Weekly Hours</span>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold">{summaryData.weeklyHours}</div>
          <div className="mt-1 text-base text-gray-400">
            Hours committed per week
          </div>
        </div>
      </div>

      {/* Abas */}
      <Tabs
        value={selectedTab}
        onValueChange={(val: string) => setSelectedTab(val)}
        className="mb-6"
      >
        <TabsList className="flex w-full rounded-xl bg-[#f5f8fd] p-1">
          <TabsTrigger
            value="overview"
            className="flex-1 rounded-lg text-base data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="tracking"
            className="flex-1 rounded-lg text-base data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Tracking
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          {/* Conteúdo da aba Overview */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="mb-2 font-semibold">Word Cloud</div>
              <WordCloud />
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="mb-2 font-semibold">Sub-Plan History</div>
              <SubPlanHistory
                subPlans={getHistoryPlans()}
                onViewHistory={handleViewHistory}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tracking">
          {/* Conteúdo da aba Tracking */}
          <div className="mt-6 text-gray-400">Tracking content here...</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StudyDashboard;
