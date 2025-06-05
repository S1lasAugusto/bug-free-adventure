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
}

export function SubPlanCard({ subPlan }: SubPlanCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

  return (
    <>
      <Card className="group border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {subPlan.topic}
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
              >
                Edit Plan
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCompleteDialogOpen(true)}
              >
                Complete
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {isEditDialogOpen && (
        <EditReflectionDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          reflection={{
            id: subPlan.id,
            type: "edit_reflection",
            control: 0,
            awareness: 0,
            strengths: 0,
            planning: 0,
            alternatives: 0,
            summary: 0,
            diagrams: 0,
            adaptation: 0,
            comment: "",
            selectedStrategies: subPlan.strategies || [],
          }}
        />
      )}

      {isCompleteDialogOpen && (
        <CompleteReflectionDialog
          open={isCompleteDialogOpen}
          onClose={() => setIsCompleteDialogOpen(false)}
          subPlanId={subPlan.id}
        />
      )}
    </>
  );
}
