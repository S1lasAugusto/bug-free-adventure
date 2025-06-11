import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface StudyPlan {
  id: string;
  title: string;
  targetGrade: number;
  createdAt: Date;
  status: "active" | "completed" | "overdue";
}

export function StudyPlan() {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);

  const getStatusIcon = (status: StudyPlan["status"]) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Study Plans</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </div>

      {studyPlans.length === 0 ? (
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-zinc-500">
              No study plans created yet. Click &quot;New Plan&quot; to get
              started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {studyPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{plan.title}</span>
                  {getStatusIcon(plan.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-500">
                    Target Grade: {plan.targetGrade}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Created: {plan.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudyPlan;
