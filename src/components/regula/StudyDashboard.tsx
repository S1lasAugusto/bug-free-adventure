import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function StudyDashboard() {
  return (
    <div className="min-h-screen bg-white px-12 py-10">
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
            <div className="text-2xl font-bold">My Study Plan</div>
            <div className="mt-1 text-sm text-gray-400">
              Java Programming • Grade A (90-100%)
            </div>
          </div>
          <div className="flex-1 rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-1 text-sm text-gray-500">Sub-Plans</div>
            <div className="text-2xl font-bold">4</div>
            <div className="mt-1 text-sm">
              <span className="font-semibold text-blue-600">● Active: 3</span>
              <span className="ml-4 text-gray-400">● Completed: 1</span>
            </div>
          </div>
          <div className="flex-1 rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-1 text-sm text-gray-500">Weekly Hours</div>
            <div className="text-2xl font-bold">20</div>
            <div className="mt-1 text-sm text-gray-400">
              Hours committed per week
            </div>
          </div>
        </div>
        <Button className="h-12 bg-blue-600 px-6 text-base font-semibold text-white hover:bg-blue-700">
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
              {/* Word Cloud aqui */}
              <div className="flex h-48 items-center justify-center rounded-lg bg-gray-50 text-gray-300">
                Plan Topics Word Cloud
              </div>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="mb-2 font-semibold">Sub-Plan History</div>
              {/* Sub-Plan History aqui */}
              <div className="flex h-48 items-center justify-center rounded-lg bg-gray-50 text-gray-300">
                Sub-Plan History Content
              </div>
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
