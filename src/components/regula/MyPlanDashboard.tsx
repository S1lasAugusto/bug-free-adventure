import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, BookOpen, BadgeCheck } from "lucide-react";
import { SubPlanWizard } from "./SubPlanWizard";
import Link from "next/link";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

interface SubPlan {
  id: string;
  name: string;
  topic: string;
  mastery: number;
  status: string;
  createdAt: string;
  selectedDays: string[];
  selectedStrategies: string[];
  customStrategies: any;
  hoursPerDay: number;
}

export function MyPlanDashboard() {
  const [selectedTab, setSelectedTab] = useState("All Plans");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Verificar o estado da sessão
  const { data: sessionData, status: sessionStatus } = useSession();

  // Consultas tRPC
  const {
    data: subPlans = [],
    refetch: refetchSubPlans,
    isError: isLoadError,
    error: loadError,
    isLoading: isLoadingPlans,
    isFetching: isFetchingPlans,
  } = api.subplanRouter.getAll.useQuery(undefined, {
    enabled: sessionStatus === "authenticated",
    retry: 1,
    staleTime: 30000, // 30 segundos
    cacheTime: 60000, // 1 minuto
    onSuccess: (data) => {
      console.log("[CLIENT] SubPlans carregados com sucesso:", data.length);
    },
    onError: (error) => {
      console.error("[CLIENT] Erro ao carregar subplans:", error.message);
    },
  });

  const createSubPlanMutation = api.subplanRouter.create.useMutation({
    onMutate: (variables) => {
      console.log("[CLIENT] Iniciando mutação");
    },
    onSuccess: (data) => {
      console.log("[CLIENT] SubPlan criado com sucesso");
      refetchSubPlans();
      toast.success("SubPlan criado com sucesso!");
    },
    onError: (error) => {
      console.error("[CLIENT] Erro ao criar subplan:", error.message);
      toast.error(`Erro ao criar subplan: ${error.message}`);
    },
  });

  // Log de debug para sessão via API - executado apenas uma vez na montagem
  useEffect(() => {
    if (sessionChecked) return;

    console.log("[CLIENT] Verificando sessão uma única vez");
    setSessionChecked(true);

    if (sessionStatus === "unauthenticated") {
      console.warn("[CLIENT] Usuário não autenticado");
    } else if (sessionStatus === "authenticated" && sessionData?.user) {
      console.log("[CLIENT] Usuário autenticado");
    }
  }, [sessionStatus, sessionData, sessionChecked]);

  if (isLoadError) {
    console.error("[CLIENT] Erro na consulta getAll:", loadError?.message);
  }

  // Filtrar os subplans com base na aba selecionada
  const filteredSubPlans =
    selectedTab === "All Plans"
      ? subPlans
      : subPlans.filter((sp) =>
          selectedTab === "Active"
            ? sp.status === "Active"
            : sp.status === "Completed"
        );

  // Função para criar um novo subplan usando a API tRPC
  function handleCreateSubPlan(data: any) {
    // Verificação básica de login
    if (!sessionData?.user) {
      toast.error("Você precisa estar logado para criar um subplan");
      return;
    }

    // Verificação básica de dados
    if (!data || !data.topic) {
      toast.error("Dados inválidos para criar subplan");
      return;
    }

    try {
      setIsLoading(true);

      // Preparar dados simplificados
      const subplanMinimal = {
        name: data.topic,
        topic: data.topic,
        mastery: data.mastery || 0,
        selectedDays: Array.isArray(data.selectedDays) ? data.selectedDays : [],
        selectedStrategies: Array.isArray(data.selectedStrategies)
          ? data.selectedStrategies
          : [],
        customStrategies: data.customStrategies || undefined,
        hoursPerDay: data.hoursPerDay || 1,
        status: "Active",
      };

      // Chamar mutação
      createSubPlanMutation.mutate(subplanMinimal);
      toast.success("Solicitação de criação enviada!");
    } catch (error) {
      toast.error("Erro ao processar solicitação");
    } finally {
      setIsLoading(false);
      setWizardOpen(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Logging para depurar */}
      <div style={{ display: "none" }}>
        DEBUG: handleCreateSubPlan={typeof handleCreateSubPlan}
      </div>

      <SubPlanWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={(data) => {
          console.log(
            "[CLIENT] MyPlanDashboard.onComplete - INVOCADO COM:",
            data
          );
          handleCreateSubPlan(data);
        }}
      />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Plans</h1>
          <p className="mt-1 text-gray-500">
            View and manage your study plans.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="h-10 px-5 text-base font-semibold"
            onClick={() => setWizardOpen(true)}
            disabled={isLoading}
          >
            <Plus className="mr-2 h-5 w-5" /> New Sub-Plan
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {["All Plans", "Active", "Completed"].map((tab) => (
          <button
            key={tab}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedTab === tab
                ? "bg-blue-600 text-white shadow"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* General Plan Card */}
      <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <div>
              <div className="text-lg font-bold">My Study Plan</div>
              <div className="text-sm text-gray-500">
                Not set • Target: Not set
              </div>
              <div className="text-sm text-gray-400">
                {subPlans.length === 0
                  ? "Create your first sub-plan to get started"
                  : `${subPlans.length} sub-plan${
                      subPlans.length === 1 ? "" : "s"
                    } created`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              Active
            </span>
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="mt-4 text-sm font-medium text-gray-500">
          Sub-Plans ({subPlans.length})
        </div>
      </div>

      {/* Sub-Plans Grid */}
      {isLoading ? (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <h3 className="mb-1 text-sm font-medium text-gray-900">Loading...</h3>
        </div>
      ) : subPlans.length === 0 ? (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <BookOpen className="mb-2 h-8 w-8 text-gray-400" />
          <h3 className="mb-1 text-sm font-medium text-gray-900">
            No sub-plans yet
          </h3>
          <p className="text-sm text-gray-500">
            Create your first sub-plan to start tracking your progress
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubPlans.map((sp) => (
            <div
              key={sp.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="text-base font-semibold">{sp.name}</div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    sp.status === "Active"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {sp.status}
                </span>
                <MoreVertical className="ml-1 h-5 w-5 text-gray-400" />
              </div>
              <div className="mb-1 text-xs text-gray-400">
                {new Date(sp.createdAt).toLocaleDateString()}
              </div>
              <div className="mb-1 flex items-center gap-1 text-sm text-gray-500">
                <BadgeCheck className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Topic:</span>
                <span className="ml-1 font-semibold text-gray-700">
                  {sp.topic}
                </span>
              </div>
              <div className="mb-2 flex items-center gap-1 text-sm text-gray-500">
                <span className="font-medium">Mastery:</span>
                <span className="ml-1 font-semibold text-blue-700">
                  {sp.mastery}%
                </span>
              </div>
              <div className="mb-3 h-2 w-full rounded-full bg-zinc-100">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${sp.mastery}%` }}
                />
              </div>
              <Link href={`/plan/${sp.id}`} className="block w-full">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPlanDashboard;
