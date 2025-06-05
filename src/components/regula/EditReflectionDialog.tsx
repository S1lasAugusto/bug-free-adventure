import React, { useState } from "react";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { ReflectionScale } from "./ReflectionScale";
import { api } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditReflectionDialogProps {
  open: boolean;
  onClose: () => void;
  subPlanId: string;
}

export function EditReflectionDialog({
  open,
  onClose,
  subPlanId,
}: EditReflectionDialogProps) {
  const utils = api.useUtils();
  // Estados para edição do plano
  const [mastery, setMastery] = useState(0);
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Estados para reflexão
  const [control, setControl] = useState(0);
  const [awareness, setAwareness] = useState(0);
  const [strengths, setStrengths] = useState(0);
  const [planning, setPlanning] = useState(0);
  const [comment, setComment] = useState("");

  // Buscar dados do plano
  const { data: subPlan } = api.subplanRouter.getById.useQuery(
    { id: subPlanId },
    {
      onSuccess: (data) => {
        if (data) {
          setMastery(data.mastery);
          setHoursPerDay(data.hoursPerDay);
          setSelectedDays(data.selectedDays);
        }
      },
    }
  );

  const updateSubPlan = api.subplanRouter.update.useMutation({
    onSuccess: () => {
      createReflection.mutate({
        subPlanId,
        type: "edit_reflection",
        control,
        awareness,
        strengths,
        planning,
        comment: comment || undefined,
      });
    },
  });

  const createReflection = api.reflectionRouter.create.useMutation({
    onSuccess: () => {
      void utils.subplanRouter.getById.invalidate({ id: subPlanId });
      onClose();
    },
  });

  const handleSubmit = () => {
    // Primeiro atualiza o plano
    updateSubPlan.mutate({
      id: subPlanId,
      mastery,
      hoursPerDay,
      selectedDays,
    });
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <HeadlessDialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <HeadlessDialog.Panel className="mx-auto max-h-[90vh] max-w-2xl rounded-lg bg-white p-6">
          <HeadlessDialog.Title className="text-lg font-medium leading-6 text-gray-900">
            Edit Plan and Reflection
          </HeadlessDialog.Title>

          <div className="mt-4 max-h-[calc(90vh-8rem)] space-y-6 overflow-y-auto">
            {/* Plan Edit Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Edit Plan</h3>

              <div>
                <Label>Mastery Level (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={mastery}
                  onChange={(e) => setMastery(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Hours per Day</Label>
                <Input
                  type="number"
                  min="1"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Days of Week</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <Button
                      key={day}
                      variant={
                        selectedDays.includes(day) ? "default" : "outline"
                      }
                      onClick={() => {
                        setSelectedDays((prev) =>
                          prev.includes(day)
                            ? prev.filter((d) => d !== day)
                            : [...prev, day]
                        );
                      }}
                      className="h-8"
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reflection Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Plan Reflection</h3>

              <ReflectionScale
                label="I have control over how well I learn."
                value={control}
                onChange={setControl}
              />

              <ReflectionScale
                label="I am aware of what strategies I use when I study."
                value={awareness}
                onChange={setAwareness}
              />

              <ReflectionScale
                label="I use my intellectual strengths to compensate for my weaknesses."
                value={strengths}
                onChange={setStrengths}
              />

              <ReflectionScale
                label="I think about what I really need to learn before I begin a task."
                value={planning}
                onChange={setPlanning}
              />

              <div>
                <Label>Comment (optional)</Label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
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
