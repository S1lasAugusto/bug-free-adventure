import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordCloud } from "./WordCloud";
import { SubPlanHistory } from "./SubPlanHistory";

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
  // MOCK: dados de exemplo
  const summaryData: SummaryCardProps = {
    generalPlan: {
      name: "My Study Plan",
      course: "Java Programming",
      grade: "Grade A (90-100%)",
    },
    subPlans: {
      total: 4,
      active: 3,
      completed: 1,
    },
    weeklyHours: 20,
    onNewSubPlan: () => alert("New Sub-Plan"),
  };

  return (
    <div
      className="min-h-screen overflow-y-auto bg-white px-12 py-10"
      style={{ maxHeight: "100vh" }}
    >
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
              <SubPlanHistory />
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
