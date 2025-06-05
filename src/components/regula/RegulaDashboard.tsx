import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { GeneralPlanModal } from "./GeneralPlanModal";

export function RegulaDashboard() {
  const [showGeneralPlanModal, setShowGeneralPlanModal] = useState(false);
  const { data: generalPlan, isLoading } = api.generalPlanRouter.get.useQuery(
    undefined,
    {
      onSuccess: (data) => {
        if (!data) {
          setShowGeneralPlanModal(true);
        }
      },
    }
  );

  return (
    <div className="p-4">
      {generalPlan && (
        <div className="mb-4 rounded-lg bg-blue-50 p-4">
          <h2 className="text-lg font-bold">
            General Plan: {generalPlan.name}
          </h2>
          <p>Grade Goal: {generalPlan.gradeGoal}</p>
        </div>
      )}
      <GeneralPlanModal
        open={showGeneralPlanModal}
        onClose={() => setShowGeneralPlanModal(false)}
        onSaved={() => {
          setShowGeneralPlanModal(false);
          window.location.reload(); // Recarrega a página para atualizar os dados
        }}
      />
      {/* Resto do conteúdo do dashboard */}
    </div>
  );
}
