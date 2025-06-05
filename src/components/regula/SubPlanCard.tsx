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

  const handleEditClick = () => {
    console.log("Edit button clicked");
    setIsEditDialogOpen(true);
  };

  const handleCompleteClick = () => {
    console.log("Complete button clicked");
    setIsCompleteDialogOpen(true);
  };

  return (
    <>
      <Card className="p-4">
        <h3 className="text-lg font-semibold">{subPlan.topic}</h3>
        <div className="mt-2 space-y-2">
          <p>Nível de domínio: {subPlan.mastery}%</p>
          <p>Dias da semana: {subPlan.daysOfWeek.join(", ")}</p>
          <p>Horas por dia: {subPlan.hoursPerDay}</p>
          <p>Estratégias: {subPlan.strategies.join(", ")}</p>
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            className="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            onClick={handleEditClick}
            type="button"
          >
            Editar
          </button>
          <button
            className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            onClick={handleCompleteClick}
            type="button"
          >
            Completar
          </button>
        </div>
      </Card>

      {isEditDialogOpen && (
        <EditReflectionDialog
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          subPlanId={subPlan.id}
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
