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
  const utils = api.useUtils();
  const [alternatives, setAlternatives] = useState(0);
  const [summary, setSummary] = useState(0);
  const [diagrams, setDiagrams] = useState(0);
  const [adaptation, setAdaptation] = useState(0);
  const [comment, setComment] = useState("");

  const createReflection = api.reflectionRouter.create.useMutation({
    onSuccess: () => {
      void utils.subplanRouter.getById.invalidate({ id: subPlanId });
      onClose();
    },
  });

  const handleSubmit = () => {
    createReflection.mutate({
      subPlanId,
      type: "complete_reflection",
      alternatives,
      summary,
      diagrams,
      adaptation,
      comment: comment || undefined,
    });
  };

  return (
    <HeadlessDialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <HeadlessDialog.Panel className="mx-auto max-h-[90vh] max-w-2xl rounded-lg bg-white p-6">
          <HeadlessDialog.Title className="text-lg font-medium leading-6 text-gray-900">
            Study Plan Reflection
          </HeadlessDialog.Title>

          <div className="mt-4 max-h-[calc(90vh-8rem)] space-y-6 overflow-y-auto">
            <ReflectionScale
              label="I think about alternatives when I get stuck."
              value={alternatives}
              onChange={setAlternatives}
            />

            <ReflectionScale
              label="I summarize what I've learned after I study."
              value={summary}
              onChange={setSummary}
            />

            <ReflectionScale
              label="I use diagrams and tables to organize information."
              value={diagrams}
              onChange={setDiagrams}
            />

            <ReflectionScale
              label="I adapt my learning strategies to different subjects."
              value={adaptation}
              onChange={setAdaptation}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Comment (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  );
}
