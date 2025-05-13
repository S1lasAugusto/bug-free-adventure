import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, BookOpen, BadgeCheck } from "lucide-react";
import { SubPlanWizard } from "./SubPlanWizard";

const mockGeneralPlan = {
  name: "My Study Plan",
  course: "Java Programming",
  target: "Grade A (90-100%)",
  description: "Complete course plan for my studies",
  createdAt: "over 1 year ago",
  status: "Active",
};

const mockSubPlans = [
  {
    id: 1,
    name: "Java Fundamentals",
    topic: "Java Fundamentals",
    mastery: 85,
    status: "Active",
    createdAt: "over 1 year ago",
  },
  {
    id: 2,
    name: "OOP Concepts",
    topic: "Object-Oriented Programming",
    mastery: 75,
    status: "Active",
    createdAt: "over 1 year ago",
  },
  {
    id: 3,
    name: "Collections Framework",
    topic: "Collections Framework",
    mastery: 90,
    status: "Completed",
    createdAt: "over 1 year ago",
  },
  {
    id: 4,
    name: "Exception Handling",
    topic: "Exception Handling",
    mastery: 70,
    status: "Completed",
    createdAt: "over 1 year ago",
  },
  {
    id: 5,
    name: "Interfaces",
    topic: "Object-Oriented Programming",
    mastery: 80,
    status: "Completed",
    createdAt: "over 1 year ago",
  },
];

const tabOptions = ["All Plans", "Active", "Completed"];

export function MyPlanDashboard() {
  const [selectedTab, setSelectedTab] = useState("All Plans");
  const [wizardOpen, setWizardOpen] = useState(false);

  const filteredSubPlans =
    selectedTab === "All Plans"
      ? mockSubPlans
      : mockSubPlans.filter((sp) =>
          selectedTab === "Active"
            ? sp.status === "Active"
            : sp.status === "Completed"
        );

  function handleCreateSubPlan(data: any) {
    // Aqui você pode adicionar lógica para adicionar o novo sub-plano
    setWizardOpen(false);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <SubPlanWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={handleCreateSubPlan}
      />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Plans</h1>
          <p className="mt-1 text-gray-500">
            View and manage your study plans.
          </p>
        </div>
        <Button
          className="h-10 px-5 text-base font-semibold"
          onClick={() => setWizardOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" /> New Sub-Plan
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {tabOptions.map((tab) => (
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
              <div className="text-lg font-bold">{mockGeneralPlan.name}</div>
              <div className="text-sm text-gray-500">
                {mockGeneralPlan.course} • Target: {mockGeneralPlan.target}
              </div>
              <div className="text-sm text-gray-400">
                {mockGeneralPlan.description}
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Created {mockGeneralPlan.createdAt}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {mockGeneralPlan.status}
            </span>
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="mt-4 text-sm font-medium text-gray-500">
          Sub-Plans ({mockSubPlans.length})
        </div>
      </div>

      {/* Sub-Plans Grid */}
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
            <div className="mb-1 text-xs text-gray-400">{sp.createdAt}</div>
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
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPlanDashboard;
