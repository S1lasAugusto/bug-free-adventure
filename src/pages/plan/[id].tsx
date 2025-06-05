import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditReflectionDialog } from "@/components/regula/EditReflectionDialog";
import { CompleteReflectionDialog } from "@/components/regula/CompleteReflectionDialog";
import {
  CheckCircle2,
  Edit,
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Clock,
  Target,
  Lightbulb,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { api } from "@/utils/api";
import { utils } from "@/utils/utils";

export default function PlanDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

  const { data: subPlan, isLoading } = api.subplanRouter.getById.useQuery(
    { id: id as string },
    { enabled: !!id }
  );

  const formatStrategyName = (strategy: string) => {
    return strategy
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!subPlan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Plan not found</div>
      </div>
    );
  }

  const weeklyStudyTime = subPlan.hoursPerDay * subPlan.selectedDays.length;

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50">
      <div className="mx-auto max-w-7xl p-8 pb-16">
        {/* Botão de voltar */}
        <div className="mb-6">
          <Link
            href="/regula/my-plan"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              Back to My Plans
            </span>
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{subPlan.topic}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Created on {new Date(subPlan.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Progress and Schedule */}
          <div className="space-y-6 lg:col-span-8">
            {/* Progress Card */}
            <Card className="group border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
              <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-50 via-blue-50/80 to-blue-50/50">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-2 shadow-sm transition-all duration-300 group-hover:bg-blue-200">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    Progress
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-4 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
                    <div className="rounded-xl bg-blue-100 p-2.5 shadow-sm">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Status
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {subPlan.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-4 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
                    <div className="rounded-xl bg-blue-100 p-2.5 shadow-sm">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">
                        Mastery
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-2.5 flex-1 rounded-full bg-gray-200">
                          <div
                            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                            style={{ width: `${subPlan.mastery}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-blue-600">
                          {subPlan.mastery}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Card */}
            <Card className="group border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
              <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-purple-50 via-purple-50/80 to-purple-50/50">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 p-2 shadow-sm transition-all duration-300 group-hover:bg-purple-200">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    Schedule
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-4 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
                    <div className="rounded-xl bg-purple-100 p-2.5 shadow-sm">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Study Days
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {subPlan.selectedDays.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-4 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
                    <div className="rounded-xl bg-purple-100 p-2.5 shadow-sm">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Hours per Day
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {subPlan.hoursPerDay} hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-4 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
                    <div className="rounded-xl bg-purple-100 p-2.5 shadow-sm">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Weekly Study Time
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {weeklyStudyTime} hours
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Strategies Card */}
            {subPlan.customStrategies &&
              Object.keys(subPlan.customStrategies).length > 0 && (
                <Card className="group border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-amber-50 via-amber-50/80 to-amber-50/50">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-amber-100 p-2 shadow-sm transition-all duration-300 group-hover:bg-amber-200">
                        <Lightbulb className="h-5 w-5 text-amber-600" />
                      </div>
                      <span className="text-lg font-semibold text-gray-900">
                        Custom Strategies
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Object.entries(subPlan.customStrategies).map(
                        ([name, description], i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm"
                          >
                            <div className="rounded-xl bg-amber-100 p-2 shadow-sm">
                              <CheckCircle2 className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">
                                {name}
                              </span>
                              <div className="mt-1 text-sm text-gray-600">
                                {description as string}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>

          {/* Right Column - Actions and Learning Strategies */}
          <div className="space-y-6 lg:col-span-4">
            {/* Actions Card */}
            <Card className="group border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
              <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-emerald-50 via-emerald-50/80 to-emerald-50/50">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2 shadow-sm transition-all duration-300 group-hover:bg-emerald-200">
                    <BadgeCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    Actions
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col gap-3">
                  <Button
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-md"
                    onClick={() => setIsCompleteDialogOpen(true)}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Complete Plan
                  </Button>
                  <Button
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-md"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4" /> Edit Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Learning Strategies Card */}
            <Card className="group border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
              <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-amber-50 via-amber-50/80 to-amber-50/50">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-100 p-2 shadow-sm transition-all duration-300 group-hover:bg-amber-200">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    Learning Strategies
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {subPlan.selectedStrategies.map((strategy, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm"
                    >
                      <div className="rounded-xl bg-amber-100 p-2 shadow-sm">
                        <CheckCircle2 className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          {formatStrategyName(strategy)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reflection Dialogs */}
      <CompleteReflectionDialog
        open={isCompleteDialogOpen}
        onClose={() => setIsCompleteDialogOpen(false)}
        subPlanId={id as string}
      />

      <EditReflectionDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        reflection={{
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
          selectedStrategies: subPlan.selectedStrategies || [],
        }}
        subPlan={{
          id: subPlan.id,
          mastery: subPlan.mastery,
          hoursPerDay: subPlan.hoursPerDay,
          selectedDays: subPlan.selectedDays,
        }}
      />
    </div>
  );
}
