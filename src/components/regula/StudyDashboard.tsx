import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordCloud } from "./WordCloud";
import { SubPlanHistory } from "./SubPlanHistory";
import { SubPlanWizard } from "./SubPlanWizard";

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

      {/* Título e subtítulo */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Study Dashboard</h1>
        <p className="mt-2 text-lg text-gray-500">
          Manage your study plans and track your progress.
        </p>
      </div>

      {/* Grid de cards de resumo e botão */}
      <div className="mb-6 flex items-start justify-between gap-6">
        <div className="flex flex-1 gap-6">
          <div className="flex-1 rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-1 text-sm text-gray-500">General Plan</div>
            <div className="text-2xl font-bold">
              {summaryData.generalPlan.name}
            </div>
            <div className="mt-1 text-sm text-gray-400">
              {summaryData.generalPlan.course} • {summaryData.generalPlan.grade}
            </div>
          </div>
          <div className="flex-1 rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-1 text-sm text-gray-500">Sub-Plans</div>
            <div className="text-2xl font-bold">
              {summaryData.subPlans.total}
            </div>
            <div className="mt-1 text-sm">
              <span className="font-semibold text-blue-600">
                ● Active: {summaryData.subPlans.active}
              </span>
              <span className="ml-4 text-gray-400">
                ● Completed: {summaryData.subPlans.completed}
              </span>
            </div>
          </div>
          <div className="flex-1 rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-1 text-sm text-gray-500">Weekly Hours</div>
            <div className="text-2xl font-bold">{summaryData.weeklyHours}</div>
            <div className="mt-1 text-sm text-gray-400">
              Hours committed per week
            </div>
          </div>
        </div>
        <Button
          className="h-12 bg-blue-600 px-6 text-base font-semibold text-white hover:bg-blue-700"
          onClick={summaryData.onNewSubPlan}
        >
          + New Sub-Plan
        </Button>
      </div>

      {/* Abas */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="flex w-full rounded-lg bg-gray-100">
          <TabsTrigger value="overview" className="flex-1">
            Overview
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex-1">
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
              <SubPlanHistory subPlans={subPlans} />
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
