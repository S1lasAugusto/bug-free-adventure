import React, { useState } from "react";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { ReflectionScale } from "./ReflectionScale";
import { api } from "@/utils/api";

interface CompleteReflectionDialogProps {
  open: boolean;
  onClose: () => void;
  subPlanId: string;
}

export function CompleteReflectionDialog({
  open,
  onClose,
  subPlanId,
}: CompleteReflectionDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [alternatives, setAlternatives] = useState(0);
  const [summary, setSummary] = useState(0);
  const [diagrams, setDiagrams] = useState(0);
  const [adaptation, setAdaptation] = useState(0);
  const [comment, setComment] = useState("");

  const utils = api.useUtils();
  const createReflection = api.reflectionRouter.create.useMutation({
    onSuccess: () => {
      void utils.subplanRouter.getById.invalidate({ id: subPlanId });
      onClose();
    },
  });
  const updateSubPlan = api.subplanRouter.updateStatus.useMutation({
    onSuccess: () => {
      void utils.subplanRouter.getById.invalidate({ id: subPlanId });
      void utils.subplanRouter.getAll.invalidate();
    },
  });

  const isValidReflection =
    alternatives >= 1 &&
    summary >= 1 &&
    diagrams >= 1 &&
    adaptation >= 1 &&
    comment.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValidReflection) {
      return;
    }
    // Cria a reflection
    await createReflection.mutateAsync({
      subPlanId,
      type: "complete_reflection",
      alternatives,
      summary,
      diagrams,
      adaptation,
      comment: comment.trim(),
    });
    // Atualiza status do plano para Completed
    await updateSubPlan.mutateAsync({
      id: subPlanId,
      status: "Completed",
    });
    onClose();
  };

  const renderStep = () => {
    return (
      <div className="space-y-6">
        <ReflectionScale
          label="I consider several alternatives to a problem before I answer."
          value={alternatives}
          onChange={setAlternatives}
        />
        <ReflectionScale
          label="I summarize what I've learned after I finish."
          value={summary}
          onChange={setSummary}
        />
        <ReflectionScale
          label="I draw pictures or diagrams to help me understand while learning."
          value={diagrams}
          onChange={setDiagrams}
        />
        <ReflectionScale
          label="I change strategies when I fail to understand."
          value={adaptation}
          onChange={setAdaptation}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="selectable mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValidReflection}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Complete Plan
          </Button>
        </div>
      </div>
    );
  };

  // Resetar ao abrir
  React.useEffect(() => {
    if (open) {
      setCurrentStep(1);
      setAlternatives(0);
      setSummary(0);
      setDiagrams(0);
      setAdaptation(0);
      setComment("");
    }
  }, [open]);

  return (
    <HeadlessDialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <HeadlessDialog.Panel className="mx-auto max-h-[90vh] max-w-2xl rounded-lg bg-white p-6">
          <HeadlessDialog.Title className="text-lg font-medium leading-6 text-gray-900">
            Complete Plan Reflection
          </HeadlessDialog.Title>
          <div className="mt-4 max-h-[calc(90vh-8rem)] space-y-6 overflow-y-auto">
            {renderStep()}
          </div>
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  );
}
