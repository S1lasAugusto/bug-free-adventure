import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";

const GRADES = ["A", "B", "C", "D", "F"];

interface GeneralPlanModalProps {
  open: boolean;
  onClose: () => void;
  initialName?: string;
  initialGrade?: string;
  isEdit?: boolean;
  onSaved?: () => void;
}

export function GeneralPlanModal({
  open,
  onClose,
  initialName = "",
  initialGrade = "A",
  isEdit = false,
  onSaved,
}: GeneralPlanModalProps) {
  const [name, setName] = useState(initialName);
  const [gradeGoal, setGradeGoal] = useState(initialGrade);
  const [loading, setLoading] = useState(false);

  const utils = api.useUtils();
  const createPlan = api.generalPlanRouter.create.useMutation({
    onSuccess: () => {
      utils.generalPlanRouter.get.invalidate();
      setLoading(false);
      onSaved?.();
      onClose();
    },
    onError: () => setLoading(false),
  });
  const updatePlan = api.generalPlanRouter.update.useMutation({
    onSuccess: () => {
      utils.generalPlanRouter.get.invalidate();
      setLoading(false);
      onSaved?.();
      onClose();
    },
    onError: () => setLoading(false),
  });

  useEffect(() => {
    setName(initialName);
    setGradeGoal(initialGrade);
  }, [initialName, initialGrade, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (isEdit) {
      updatePlan.mutate({ name, gradeGoal });
    } else {
      createPlan.mutate({ name, gradeGoal });
    }
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
          <Dialog.Title className="mb-4 text-xl font-bold">
            {isEdit ? "Edit General Plan" : "Create General Plan"}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Plan Name</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter plan name"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Grade Goal</label>
              <select
                className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={gradeGoal}
                onChange={(e) => setGradeGoal(e.target.value)}
                disabled={loading}
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !name}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
