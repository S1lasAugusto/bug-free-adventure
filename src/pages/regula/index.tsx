import React, { useEffect, useState } from "react";
import { StudySidebar } from "@/components/regula/StudySidebar";
import { StudyDashboard } from "@/components/regula/StudyDashboard";
import { GradeDialog } from "@/components/regula/GradeDialog";
import { api } from "@/utils/api";

export default function RegulaPage() {
  const [showDialog, setShowDialog] = useState(false);
  const { data: generalPlan, isLoading } = api.generalPlanRouter.get.useQuery();

  useEffect(() => {
    if (!isLoading && !generalPlan) {
      setShowDialog(true);
    }
  }, [generalPlan, isLoading]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudySidebar />
      <div className="flex-1">
        <StudyDashboard />
      </div>
    </div>
  );
}
