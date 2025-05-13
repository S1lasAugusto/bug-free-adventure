import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordCloud } from "./WordCloud";
import { SubPlanHistory } from "./SubPlanHistory";
import { SubPlanWizard } from "./SubPlanWizard";
import { SubPlanHistoryModal } from "./SubPlanHistoryModal";
import { GraduationCap, List, Clock } from "lucide-react";
import { Plus } from "lucide-react";
import { StudyPlan } from "./StudyPlan";

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

interface SubPlan {
  id: string;
  name: string;
  status: "active" | "completed";
  lastModified: string;
  topic: string;
  changes: number;
  mastery?: number;
}

export function StudyDashboard() {
  // MOCK: dados de exemplo
  const [subPlans, setSubPlans] = useState<SubPlan[]>([
    {
      id: "1",
      name: "Java Fundamentals",
      status: "active",
      lastModified: "10/15/2023",
      topic: "Java Fundamentals",
      changes: 4,
    },
    {
      id: "2",
      name: "OOP Concepts",
      status: "active",
      lastModified: "10/10/2023",
      topic: "OOP Concepts",
      changes: 2,
    },
    {
      id: "3",
      name: "Collections",
      status: "completed",
      lastModified: "09/30/2023",
      topic: "Collections",
      changes: 5,
    },
  ]);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubPlan | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  const summaryData: SummaryCardProps = {
    generalPlan: {
      name: "My Study Plan",
      course: "Java Programming",
      grade: "Grade A (90-100%)",
    },
    subPlans: {
      total: subPlans.length,
      active: subPlans.filter((s) => s.status === "active").length,
      completed: subPlans.filter((s) => s.status === "completed").length,
    },
    weeklyHours: 20,
    onNewSubPlan: () => setWizardOpen(true),
  };

  function handleCreateSubPlan(data: { topic: string; mastery: number }) {
    setSubPlans((prev) => [
      {
        id: (prev.length + 1).toString(),
        name: data.topic,
        status: "active",
        lastModified: new Date().toLocaleDateString(),
        topic: data.topic,
        changes: 0,
        mastery: data.mastery,
      },
      ...prev,
    ]);
    setWizardOpen(false);
  }

  function handleViewHistory(plan: SubPlan) {
    setSelectedPlan(plan);
    setHistoryModalOpen(true);
  }

  console.log("selectedTab", selectedTab);

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
          events={[
            {
              type: "progress",
              title: "Progress Updated",
              date: "Oct 21, 2023 at 8:10 PM",
              from: "45",
              to: "65",
              reflection: {
                impact: "Completed chapter exercises",
                reason: "Applied new learning strategies",
                effectiveness: "high",
              },
              relativeTime: "over 1 year ago",
            },
            {
              type: "strategy",
              title: "Strategy Changed",
              date: "Oct 19, 2023 at 11:20 AM",
              from: "Pomodoro Technique, Active Recall",
              to: "Pomodoro Technique, Active Recall, Practice Tests",
              reflection: {
                impact: "Added practice tests to improve retention",
                reason: "Needed more hands-on practice",
                effectiveness: "high",
              },
              relativeTime: "over 1 year ago",
            },
            {
              type: "progress",
              title: "Progress Updated",
              date: "Oct 17, 2023 at 5:45 PM",
              from: "30",
              to: "45",
              reflection: {
                impact: "Completed two practice exercises",
                reason: "Dedicated more time to studying",
                effectiveness: "medium",
              },
              relativeTime: "over 1 year ago",
            },
            {
              type: "created",
              title: "Plan Created",
              date: "Oct 15, 2023 at 12:30 PM",
              relativeTime: "over 1 year ago",
            },
          ]}
        />
      )}

      {/* Título e subtítulo */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Study Dashboard</h1>
        <p className="mt-2 text-lg text-gray-500">
          Manage your study plans and track your progress.
        </p>
      </div>

      {/* Botão no topo alinhado à direita */}
      <div className="mb-4 flex justify-end">
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
            value="myplan"
            className="flex-1 rounded-lg text-base data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            My Plan
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
                subPlans={subPlans}
                onViewHistory={handleViewHistory}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="myplan">
          <div className="mt-6">
            <StudyPlan />
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
