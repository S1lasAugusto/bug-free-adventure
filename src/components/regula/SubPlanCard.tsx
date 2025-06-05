import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditReflectionDialog } from "./EditReflectionDialog";
import { CompleteReflectionDialog } from "./CompleteReflectionDialog";

interface SubPlanCardProps {
  subPlan: {
    id: string;
    topic: string;
    mastery: number;
    daysOfWeek: string[];
    hoursPerDay: number;
    strategies: string[];
  };
  reflection: {
    id: string;
    type: string;
    control: number;
    awareness: number;
    strengths: number;
    planning: number;
    alternatives: number;
    summary: number;
    diagrams: number;
    adaptation: number;
    comment: string;
    selectedStrategies: string[];
  };
  onEdit: () => void;
  onComplete: () => void;
}

export function SubPlanCard({
  subPlan,
  reflection,
  onEdit,
  onComplete,
}: SubPlanCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{subPlan.topic}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            Edit Plan
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCompleteDialogOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            Complete
          </Button>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Mastery Level</span>
          <span className="font-medium text-gray-900">{subPlan.mastery}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Hours per Day</span>
          <span className="font-medium text-gray-900">
            {subPlan.hoursPerDay}h
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Days per Week</span>
          <span className="font-medium text-gray-900">
            {subPlan.daysOfWeek.length} days
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {subPlan.daysOfWeek.map((day) => (
          <span
            key={day}
            className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
          >
            {day.slice(0, 3)}
          </span>
        ))}
      </div>

      <EditReflectionDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        reflection={{
          id: reflection?.id || "",
          type: reflection?.type || "edit_reflection",
          control: reflection?.control || 0,
          awareness: reflection?.awareness || 0,
          strengths: reflection?.strengths || 0,
          planning: reflection?.planning || 0,
          alternatives: reflection?.alternatives || 0,
          summary: reflection?.summary || 0,
          diagrams: reflection?.diagrams || 0,
          adaptation: reflection?.adaptation || 0,
          comment: reflection?.comment || "",
          selectedStrategies: reflection?.selectedStrategies || [],
        }}
        subPlan={{
          id: subPlan.id,
          mastery: subPlan.mastery,
          hoursPerDay: subPlan.hoursPerDay,
          selectedDays: subPlan.daysOfWeek,
        }}
      />

      <CompleteReflectionDialog
        isOpen={isCompleteDialogOpen}
        onClose={() => setIsCompleteDialogOpen(false)}
        reflection={reflection}
        onComplete={onComplete}
      />
    </div>
  );
}
