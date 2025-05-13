import React from "react";
import { StudySidebar } from "@/components/regula/StudySidebar";
import { StudyDashboard } from "@/components/regula/StudyDashboard";

export default function RegulaPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudySidebar />
      <div className="flex-1">
        <StudyDashboard />
      </div>
    </div>
  );
}
