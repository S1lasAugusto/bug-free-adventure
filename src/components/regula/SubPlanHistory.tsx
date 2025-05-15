import React from "react";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

interface SubPlan {
  id: string;
  name: string;
  status: "active" | "completed";
  lastModified: string;
  topic: string;
  changes: number;
  mastery?: number;
}

interface SubPlanHistoryProps {
  subPlans: SubPlan[];
  onViewHistory: (plan: SubPlan) => void;
}

export function SubPlanHistory({
  subPlans,
  onViewHistory,
}: SubPlanHistoryProps) {
  if (subPlans.length === 0) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
        <History className="mb-2 h-8 w-8 text-gray-400" />
        <h3 className="mb-1 text-sm font-medium text-gray-900">
          No sub-plans yet
        </h3>
        <p className="text-sm text-gray-500">
          Create your first sub-plan to start tracking your progress
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subPlans.map((plan) => (
        <div
          key={plan.id}
          className="flex items-center justify-between rounded-lg border bg-white p-4"
        >
          <div>
            <h3 className="font-medium">{plan.name}</h3>
            <p className="text-sm text-gray-500">
              Last modified: {plan.lastModified}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                plan.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {plan.status}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewHistory(plan)}
            >
              View History
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubPlanHistory;
