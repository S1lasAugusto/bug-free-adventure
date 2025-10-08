import React from "react";
import { MyPlanDashboard } from "@/components/regula/MyPlanDashboard";

export default function MyPlanPage() {
  return (
    <div className="h-screen flex-1 overflow-y-auto">
      <div className="px-12 py-10">
        <MyPlanDashboard />
      </div>
    </div>
  );
}
