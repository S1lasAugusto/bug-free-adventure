import React, { useState, useEffect } from "react";
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
import { toast } from "react-hot-toast";

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
  };
}

const RatingScale = ({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
}) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        {[0, 1, 2, 3, 4, 5].map((rating) => (
          <label
            key={rating}
            className="flex cursor-pointer items-center gap-2"
          >
            <input
              type="radio"
              name={label}
              value={rating}
              checked={value === rating}
              onChange={() => onChange(rating)}
              className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-600"
            />
            <span className="text-sm font-medium text-gray-700">{rating}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export function EditReflectionDialog({
  isOpen,
  onClose,
  reflection,
  subPlan,
}: EditReflectionDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: reflection.type,
    control: reflection.control,
    awareness: reflection.awareness,
    strengths: reflection.strengths,
    planning: reflection.planning,
    comment: reflection.comment,
    selectedStrategies: reflection.selectedStrategies,
    mastery: subPlan?.mastery ?? 0,
    hoursPerDay: subPlan?.hoursPerDay ?? 1,
    selectedDays: subPlan?.selectedDays ?? [],
  });

  const [customStrategies, setCustomStrategies] = useState<{
    [key: string]: string;
  }>({});

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
    },
    onError: (error) => {
      toast.error(`Error updating plan: ${error.message}`);
    },
  });

  // Sempre que abrir o dialog ou mudar o subPlan/reflection, sincroniza o formData
  useEffect(() => {
    if (isOpen && subPlan) {
      setFormData({
        type: reflection.type,
        control: reflection.control,
        awareness: reflection.awareness,
        strengths: reflection.strengths,
        planning: reflection.planning,
        comment: reflection.comment,
        selectedStrategies: reflection.selectedStrategies,
        mastery: subPlan.mastery,
        hoursPerDay: subPlan.hoursPerDay,
        selectedDays: subPlan.selectedDays,
      });
      setCurrentStep(1);
    }
  }, [isOpen, subPlan, reflection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvando alterações...", { formData, subPlan, reflection });

    if (!subPlan?.id) {
      console.error("ID do subplan não encontrado", subPlan);
      toast.error("Error: Plan ID not found");
      return;
    }

    try {
      // Atualiza o plano
      await updateSubPlan.mutateAsync({
        id: subPlan.id,
        mastery: formData.mastery,
        hoursPerDay: formData.hoursPerDay,
        selectedDays: formData.selectedDays,
        selectedStrategies: formData.selectedStrategies,
      });

      // Atualiza ou cria a reflexão
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

      toast.success("Changes saved successfully!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
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
            <div className="space-y-6">
              <RatingScale
                label="I have control over how well I learn."
                value={formData.control}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, control: value }))
                }
              />

              <RatingScale
                label="I am aware of what strategies I use when I study."
                value={formData.awareness}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, awareness: value }))
                }
              />

              <RatingScale
                label="I use my intellectual strengths to compensate for my weaknesses."
                value={formData.strengths}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, strengths: value }))
                }
              />

              <RatingScale
                label="I think about what I really need to learn before I begin a task."
                value={formData.planning}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, planning: value }))
                }
              />

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
                onClick={handleSubmit}
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
