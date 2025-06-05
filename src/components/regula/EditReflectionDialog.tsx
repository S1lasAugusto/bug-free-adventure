import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/utils/api";
import { CheckCircle2, X } from "lucide-react";

const LEARNING_STRATEGIES = [
  "active_recall",
  "spaced_repetition",
  "pomodoro_technique",
  "mind_mapping",
  "feynman_technique",
  "practice_by_teaching",
  "interleaving",
  "dual_coding",
  "elaboration",
  "concrete_examples",
  "retrieval_practice",
  "self_explanation",
];

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const formatStrategyName = (strategy: string) => {
  return strategy
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

interface EditReflectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reflection: {
    id: string;
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
  };
}

export function EditReflectionDialog({
  isOpen,
  onClose,
  reflection,
  subPlan,
}: EditReflectionDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: reflection?.type || "edit_reflection",
    control: reflection?.control || 0,
    awareness: reflection?.awareness || 0,
    strengths: reflection?.strengths || 0,
    planning: reflection?.planning || 0,
    alternatives: reflection?.alternatives || 0,
    summary: reflection?.summary || 0,
    diagrams: reflection?.diagrams || 0,
    adaptation: reflection?.adaptation || 0,
    comment: reflection?.comment || "",
    selectedStrategies: reflection?.selectedStrategies || [],
    mastery: subPlan?.mastery || 0,
    hoursPerDay: subPlan?.hoursPerDay || 1,
    selectedDays: subPlan?.selectedDays || [],
  });

  const [customStrategies, setCustomStrategies] = useState<{
    [key: string]: string;
  }>({});

  const utils = api.useUtils();
  const updateReflection = api.reflectionRouter.update.useMutation({
    onSuccess: () => {
      utils.reflectionRouter.getAll.invalidate();
      onClose();
    },
  });

  const updateSubPlan = api.subplanRouter.update.useMutation({
    onSuccess: () => {
      utils.subplanRouter.getById.invalidate({ id: subPlan.id });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflection?.id || !subPlan?.id) return;

    // Primeiro atualiza o plano
    updateSubPlan.mutate({
      id: subPlan.id,
      mastery: formData.mastery,
      hoursPerDay: formData.hoursPerDay,
      selectedDays: formData.selectedDays,
    });

    // Depois atualiza a reflexão
    updateReflection.mutate({
      id: reflection.id,
      type: formData.type,
      control: formData.control,
      awareness: formData.awareness,
      strengths: formData.strengths,
      planning: formData.planning,
      alternatives: formData.alternatives,
      summary: formData.summary,
      diagrams: formData.diagrams,
      adaptation: formData.adaptation,
      comment: formData.comment,
    });
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
    const name = prompt("Enter strategy name:");
    if (name) {
      const description = prompt("Enter strategy description:");
      if (description) {
        setCustomStrategies((prev) => ({
          ...prev,
          [name]: description,
        }));
      }
    }
  };

  const handleCustomStrategyRemove = (name: string) => {
    setCustomStrategies((prev) => {
      const newStrategies = { ...prev };
      delete newStrategies[name];
      return newStrategies;
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Mastery Level (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.mastery}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mastery: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label>Hours per Day</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.hoursPerDay}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hoursPerDay: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label>Days of Week</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <Button
                      key={day}
                      variant={
                        formData.selectedDays.includes(day)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleDayToggle(day)}
                      className="h-8"
                    >
                      {day.slice(0, 3)}
                    </Button>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Learning Strategies</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCustomStrategyAdd}
                >
                  Add Custom Strategy
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {LEARNING_STRATEGIES.map((strategy) => (
                  <div
                    key={strategy}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 transition-colors hover:border-gray-300"
                  >
                    <button
                      type="button"
                      onClick={() => handleStrategyToggle(strategy)}
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-gray-400"
                    >
                      {formData.selectedStrategies.includes(strategy) && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      )}
                    </button>
                    <span className="text-sm font-medium text-gray-900">
                      {formatStrategyName(strategy)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(customStrategies).length > 0 && (
              <div className="space-y-4">
                <Label>Custom Strategies</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(customStrategies).map(
                    ([name, description]) => (
                      <div
                        key={name}
                        className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:border-gray-300"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCustomStrategyRemove(name)}
                              className="text-gray-400 transition-colors hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {description}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

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
            <div className="space-y-4">
              <div>
                <Label htmlFor="control">
                  I have control over how well I learn.
                </Label>
                <Input
                  id="control"
                  type="number"
                  min="0"
                  max="5"
                  value={formData.control}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      control: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="awareness">
                  I am aware of what strategies I use when I study.
                </Label>
                <Input
                  id="awareness"
                  type="number"
                  min="0"
                  max="5"
                  value={formData.awareness}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      awareness: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="strengths">
                  I use my intellectual strengths to compensate for my
                  weaknesses.
                </Label>
                <Input
                  id="strengths"
                  type="number"
                  min="0"
                  max="5"
                  value={formData.strengths}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      strengths: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="planning">
                  I think about what I really need to learn before I begin a
                  task.
                </Label>
                <Input
                  id="planning"
                  type="number"
                  min="0"
                  max="5"
                  value={formData.planning}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      planning: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="alternatives">
                  I think about alternatives when I get stuck.
                </Label>
                <Input
                  id="alternatives"
                  type="number"
                  min="0"
                  max="5"
                  value={formData.alternatives}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      alternatives: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="summary">
                  I summarize what I've learned after I study.
                </Label>
                <Input
                  id="summary"
                  type="number"
                  min="0"
                  max="5"
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      summary: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="diagrams">
                  I use diagrams and tables to organize information.
                </Label>
                <Input
                  id="diagrams"
                  type="number"
                  min="0"
                  max="5"
                  value={formData.diagrams}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      diagrams: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="adaptation">
                  I adapt my learning strategies to different subjects.
                </Label>
                <Input
                  id="adaptation"
                  type="number"
                  min="0"
                  max="5"
                  value={formData.adaptation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      adaptation: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="comment">Comment (optional)</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white">
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
