import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/utils/api";

import { toast } from "react-hot-toast";
import { ReflectionScale } from "./ReflectionScale";
import {
  DEFAULT_STRATEGIES,
  buildCustomStrategiesPayload,
  normalizeCustomStrategies,
  normalizeStrategyIds,
} from "@/lib/regula/strategies";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface EditReflectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reflection: {
    id?: string;
    type: string;
    control: number;
    awareness: number;
    strengths: number;
    planning: number;
    alternatives: number;
    summary: number;
    diagrams: number;
    adaptation: number;
    comment: string;
    selectedStrategies: string[];
  };
  subPlan: {
    id: string;
    mastery: number;
    hoursPerDay: number;
    selectedDays: string[];
    selectedStrategies?: string[];
    customStrategies?: unknown;
  };
}

export function EditReflectionDialog({
  isOpen,
  onClose,
  reflection,
  subPlan,
}: EditReflectionDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [formData, setFormData] = useState({
    type: reflection.type,
    control: reflection.control,
    awareness: reflection.awareness,
    strengths: reflection.strengths,
    planning: reflection.planning,
    comment: reflection.comment,
    selectedStrategies: normalizeStrategyIds(
      subPlan?.selectedStrategies ?? reflection.selectedStrategies
    ),
    mastery: subPlan?.mastery ?? 0,
    hoursPerDay: subPlan?.hoursPerDay ?? 1,
    selectedDays: subPlan?.selectedDays ?? [],
  });

  const [customStrategies, setCustomStrategies] = useState(
    normalizeCustomStrategies(subPlan?.customStrategies)
  );
  const [customStrategyName, setCustomStrategyName] = useState("");
  const [customStrategyDescription, setCustomStrategyDescription] =
    useState("");

  const utils = api.useUtils();
  const createReflection = api.reflectionRouter.create.useMutation({
    onSuccess: () => {
      utils.reflectionRouter.getAll.invalidate();
      toast.success("Changes saved successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error(`Error saving changes: ${error.message}`);
    },
  });

  const updateReflection = api.reflectionRouter.update.useMutation({
    onSuccess: () => {
      utils.reflectionRouter.getAll.invalidate();
      toast.success("Changes saved successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error(`Error saving changes: ${error.message}`);
    },
  });

  const updateSubPlan = api.subplanRouter.update.useMutation({
    onSuccess: () => {
      utils.subplanRouter.getById.invalidate({ id: subPlan.id });
      utils.subplanRouter.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(`Error updating plan: ${error.message}`);
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setIsInitialized(false);
      return;
    }

    if (!isInitialized && subPlan) {
      setFormData({
        type: reflection.type,
        control: reflection.control,
        awareness: reflection.awareness,
        strengths: reflection.strengths,
        planning: reflection.planning,
        comment: reflection.comment,
        selectedStrategies: normalizeStrategyIds(
          subPlan.selectedStrategies ?? reflection.selectedStrategies
        ),
        mastery: subPlan.mastery,
        hoursPerDay: subPlan.hoursPerDay,
        selectedDays: subPlan.selectedDays,
      });
      setCustomStrategies(normalizeCustomStrategies(subPlan.customStrategies));
      setCustomStrategyName("");
      setCustomStrategyDescription("");
      setCurrentStep(1);
      setIsInitialized(true);
    }
  }, [isOpen, isInitialized, subPlan, reflection]);

  const isReflectionStepValid =
    formData.control >= 1 &&
    formData.awareness >= 1 &&
    formData.strengths >= 1 &&
    formData.planning >= 1 &&
    formData.comment.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subPlan?.id) {
      toast.error("Error: Plan ID not found");
      return;
    }

    if (!isReflectionStepValid) {
      toast.error("Please complete all reflection fields before saving.");
      return;
    }

    try {
      await updateSubPlan.mutateAsync({
        id: subPlan.id,
        mastery: formData.mastery,
        hoursPerDay: formData.hoursPerDay,
        selectedDays: formData.selectedDays,
        selectedStrategies: normalizeStrategyIds(formData.selectedStrategies),
        customStrategies: buildCustomStrategiesPayload(customStrategies),
      });

      if (reflection?.id) {
        await updateReflection.mutateAsync({
          id: reflection.id,
          type: formData.type,
          control: formData.control,
          awareness: formData.awareness,
          strengths: formData.strengths,
          planning: formData.planning,
          comment: formData.comment,
        });
      } else {
        await createReflection.mutateAsync({
          type: formData.type,
          control: formData.control,
          awareness: formData.awareness,
          strengths: formData.strengths,
          planning: formData.planning,
          comment: formData.comment,
          subPlanId: subPlan.id,
        });
      }
    } catch (error) {
      toast.error("Error saving changes");
    }
  };

  const handleStrategyToggle = (strategy: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedStrategies: prev.selectedStrategies.includes(strategy)
        ? prev.selectedStrategies.filter((s) => s !== strategy)
        : [...prev.selectedStrategies, strategy],
    }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };

  const handleCustomStrategyAdd = () => {
    const name = customStrategyName.trim();
    if (!name) return;

    const customId = `custom_${name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")}`;

    setCustomStrategies((prev) => [
      ...prev.filter((strategy) => strategy.id !== customId),
      {
        id: customId,
        name,
        description: customStrategyDescription.trim() || undefined,
      },
    ]);
    setCustomStrategyName("");
    setCustomStrategyDescription("");
  };

  const handleCustomStrategyRemove = (id: string) => {
    setCustomStrategies((prev) =>
      prev.filter((strategy) => strategy.id !== id)
    );
    setFormData((prev) => ({
      ...prev,
      selectedStrategies: prev.selectedStrategies.filter(
        (strategy) => strategy !== id
      ),
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="mastery">Mastery Level</Label>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    type="range"
                    id="mastery"
                    min="0"
                    max="100"
                    value={formData.mastery}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        mastery: parseInt(e.target.value),
                      }))
                    }
                    className="h-2 w-full rounded-lg bg-gray-200"
                  />
                  <span className="min-w-[3rem] text-right font-medium">
                    {formData.mastery}%
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="hoursPerDay">Hours per Day</Label>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    type="range"
                    id="hoursPerDay"
                    min="1"
                    max="8"
                    value={formData.hoursPerDay}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hoursPerDay: parseInt(e.target.value),
                      }))
                    }
                    className="h-2 w-full rounded-lg bg-gray-200"
                  />
                  <span className="min-w-[3rem] text-right font-medium">
                    {formData.hoursPerDay}h
                  </span>
                </div>
              </div>

              <div>
                <Label>Days of the Week</Label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                        formData.selectedDays.includes(day)
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Next Step
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-2 flex items-center gap-2 text-lg font-semibold">
              <span className="inline-block rounded-full bg-blue-100 p-2">
                <svg width="24" height="24" fill="none">
                  <path d="M12 2v20M2 12h20" stroke="#2563eb" strokeWidth="2" />
                </svg>
              </span>
              Strategy Selection
            </div>
            <div className="mb-2 text-gray-500">
              Choose your preferred learning strategies
            </div>
            <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <div className="mb-2 font-medium">Add your own strategy:</div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <input
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Strategy Name"
                  value={customStrategyName}
                  onChange={(e) => setCustomStrategyName(e.target.value)}
                />
                <input
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:ml-2"
                  placeholder="Description (optional)"
                  value={customStrategyDescription}
                  onChange={(e) => setCustomStrategyDescription(e.target.value)}
                />
                <Button
                  type="button"
                  className="mt-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 md:mt-0"
                  onClick={handleCustomStrategyAdd}
                  disabled={!customStrategyName.trim()}
                >
                  Add Strategy
                </Button>
              </div>
            </div>
            <div className="mb-2 font-medium">
              Select your preferred learning strategies:
            </div>
            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
              {/* Estratégias padrão */}
              {DEFAULT_STRATEGIES.map((strategy) => (
                <button
                  key={strategy.id}
                  type="button"
                  className={`flex flex-col items-start rounded-lg border px-4 py-2 text-left text-sm font-medium transition-all duration-200 ${
                    formData.selectedStrategies.includes(strategy.id)
                      ? "border-blue-600 bg-blue-600 text-white shadow"
                      : "border-zinc-300 bg-gray-100 text-gray-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleStrategyToggle(strategy.id)}
                >
                  <span className="font-semibold">{strategy.name}</span>
                  <span className="text-xs text-gray-400">
                    {strategy.description}
                  </span>
                </button>
              ))}
              {/* Estratégias customizadas */}
              {customStrategies.map((strategy) => {
                const isSelected = formData.selectedStrategies.includes(
                  strategy.id
                );
                return (
                  <div key={strategy.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      className={`flex flex-1 flex-col items-start rounded-lg border px-4 py-2 text-left text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white shadow"
                          : "border-zinc-300 bg-gray-100 text-gray-700 hover:bg-blue-50"
                      }`}
                      onClick={() => handleStrategyToggle(strategy.id)}
                    >
                      <span className="font-semibold">{strategy.name}</span>
                      {strategy.description && (
                        <span className="text-xs text-gray-400">
                          {strategy.description}
                        </span>
                      )}
                    </button>
                    <button
                      className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCustomStrategyRemove(strategy.id);
                      }}
                      tabIndex={-1}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Previous Step
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Next Step
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              <ReflectionScale
                label="I have control over how well I learn."
                value={formData.control}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, control: value }))
                }
              />

              <ReflectionScale
                label="I am aware of what strategies I use when I study."
                value={formData.awareness}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, awareness: value }))
                }
              />

              <ReflectionScale
                label="I use my intellectual strengths to compensate for my weaknesses."
                value={formData.strengths}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, strengths: value }))
                }
              />

              <ReflectionScale
                label="I think about what I really need to learn before I begin a task."
                value={formData.planning}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, planning: value }))
                }
              />

              <div>
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  className="selectable"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(2)}
              >
                Previous Step
              </Button>
              <Button
                type="submit"
                disabled={!isReflectionStepValid}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Save Changes
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-white">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Edit Plan and Reflection
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}
        </form>
      </DialogContent>
    </Dialog>
  );
}
