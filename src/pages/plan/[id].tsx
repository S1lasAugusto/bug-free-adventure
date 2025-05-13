import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Edit,
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Clock,
  Target,
  Lightbulb,
} from "lucide-react";

const samplePlan = {
  id: "1",
  name: "Java Fundamentals",
  topic: "Java Fundamentals",
  mastery: 85,
  status: "Active",
  createdAt: "10/15/2023",
  studyDays: "Monday, Wednesday, Friday",
  hoursPerDay: "2 hours",
  weeklyStudyTime: "6 hours",
  strategies: [
    {
      name: "Pomodoro Technique",
      description: "Work for 25 minutes, then take a 5-minute break",
    },
    {
      name: "Active Recall",
      description:
        "Test yourself on the material instead of passively reviewing",
    },
    {
      name: "Practice Tests",
      description: "Take practice exams to simulate test conditions",
    },
  ],
};

export default function PlanDetailPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white px-8 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Botão Back to Dashboard */}
        <div className="mb-4">
          <Link href="/regula/my-plan">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>
        {/* Grid principal */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card principal do plano */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="flex-1 text-2xl font-bold">
                  {samplePlan.name}
                </CardTitle>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {samplePlan.status}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Created on {samplePlan.createdAt}
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-fit">
                Overview
              </Button>
            </CardHeader>
            <CardContent>
              {/* Goal e Schedule */}
              <div className="mt-2 flex flex-col gap-8 md:flex-row">
                {/* Goal */}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Target className="h-5 w-5 text-gray-700" />
                    <span className="text-lg font-semibold">Goal</span>
                  </div>
                  <div className="mb-1 ml-7 text-sm">
                    <span className="font-medium">Topic:</span>{" "}
                    {samplePlan.topic}
                  </div>
                  <div className="ml-7 text-sm">
                    <span className="font-medium">Target Mastery:</span>{" "}
                    {samplePlan.mastery}%
                  </div>
                </div>
                {/* Schedule */}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-700" />
                    <span className="text-lg font-semibold">Schedule</span>
                  </div>
                  <div className="mb-1 ml-7 text-sm">
                    <span className="font-medium">Study Days:</span>{" "}
                    {samplePlan.studyDays}
                  </div>
                  <div className="mb-1 ml-7 text-sm">
                    <span className="font-medium">Hours per Day:</span>{" "}
                    {samplePlan.hoursPerDay}
                  </div>
                  <div className="ml-7 text-sm">
                    <span className="font-medium">Weekly Study Time:</span>{" "}
                    {samplePlan.weeklyStudyTime}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Card de ações */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-gray-700" />
                <span className="text-lg font-semibold">Actions</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <Button className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4" /> Complete Plan
                </Button>
                <Button className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600">
                  <Edit className="h-4 w-4" /> Edit Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Card de Learning Strategies */}
        <Card>
          <CardHeader>
            <div className="mb-2 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span className="text-xl font-semibold">Learning Strategies</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="ml-2 mt-2 flex flex-col gap-2">
              {samplePlan.strategies.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <div>
                    <span className="font-semibold">{s.name}</span>
                    <div className="text-sm text-gray-600">{s.description}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
