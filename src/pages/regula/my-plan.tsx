import React from "react";
import { StudySidebar } from "@/components/regula/StudySidebar";
import { MyPlanDashboard } from "@/components/regula/MyPlanDashboard";

export default function MyPlanPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudySidebar />
      <div className="flex-1 px-12 py-10">
        <MyPlanDashboard />
      </div>
    </div>
  );
}
