import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";

export interface SubPlanHistoryEvent {
  type: "progress" | "strategy" | "created";
  title: string;
  date: string;
  from?: string;
  to?: string;
  reflection?: {
    impact?: string;
    reason?: string;
    effectiveness?: "high" | "medium" | "low";
  };
  relativeTime?: string;
}

interface SubPlanHistoryModalProps {
  open: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  title: string;
  subtitle: string;
  events: SubPlanHistoryEvent[];
}

export function SubPlanHistoryModal({
  open,
  onClose,
  onViewDetails,
  title,
  subtitle,
  events,
}: SubPlanHistoryModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 transition-opacity duration-300"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-h-[92vh] w-full max-w-2xl rounded-2xl bg-white p-0 shadow-2xl transition-all duration-300">
          <div className="max-h-[84vh] overflow-y-auto p-8">
            <Dialog.Title className="mb-1 flex items-center gap-2 text-2xl font-bold text-blue-800">
              <span className="inline-block rounded bg-blue-100 p-1">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="16"
                    rx="2"
                    stroke="#2563eb"
                    strokeWidth="2"
                  />
                  <path d="M7 4v16" stroke="#2563eb" strokeWidth="2" />
                </svg>
              </span>
              {title}
            </Dialog.Title>
            <div className="mb-6 text-base text-blue-600">{subtitle}</div>
            <div className="space-y-8">
              {events.map((event, idx) => (
                <div
                  key={idx}
                  className="relative rounded-lg border border-zinc-200 bg-zinc-50 p-6 shadow-sm"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`inline-block rounded-full p-1 ${
                        event.type === "progress"
                          ? "bg-yellow-100"
                          : event.type === "strategy"
                          ? "bg-pink-100"
                          : "bg-green-100"
                      }`}
                    >
                      {event.type === "progress" && (
                        <span className="text-yellow-500">→</span>
                      )}
                      {event.type === "strategy" && (
                        <span className="text-pink-500">💡</span>
                      )}
                      {event.type === "created" && (
                        <span className="text-green-600">★</span>
                      )}
                    </span>
                    <span className="text-lg font-bold text-zinc-800">
                      {event.title}
                    </span>
                    <span className="ml-auto text-xs font-medium text-blue-700">
                      {event.date}
                    </span>
                  </div>
                  {event.from && (
                    <div className="mb-1 text-sm text-zinc-700">
                      <span className="font-semibold">From:</span> {event.from}
                    </div>
                  )}
                  {event.to && (
                    <div className="mb-1 text-sm text-zinc-700">
                      <span className="font-semibold">To:</span> {event.to}
                    </div>
                  )}
                  {event.reflection && (
                    <div className="mt-3 rounded bg-white/80 p-3 text-sm">
                      <div className="mb-1 font-semibold text-zinc-700">
                        Reflection
                      </div>
                      {event.reflection.impact && (
                        <div className="text-zinc-700">
                          <span className="font-semibold">Impact:</span>{" "}
                          {event.reflection.impact}
                        </div>
                      )}
                      {event.reflection.reason && (
                        <div className="text-zinc-700">
                          <span className="font-semibold">Reason:</span>{" "}
                          {event.reflection.reason}
                        </div>
                      )}
                      {event.reflection.effectiveness && (
                        <div className="text-zinc-700">
                          <span className="font-semibold">Effectiveness:</span>{" "}
                          <span
                            className={`inline-block rounded px-2 py-0.5 text-xs font-bold text-white ${
                              event.reflection.effectiveness === "high"
                                ? "bg-blue-600"
                                : event.reflection.effectiveness === "medium"
                                ? "bg-yellow-500"
                                : "bg-zinc-400"
                            }`}
                          >
                            {event.reflection.effectiveness}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {event.relativeTime && (
                    <div className="mt-2 text-xs text-zinc-400">
                      {event.relativeTime}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-between gap-2">
              <Button variant="outline" onClick={onViewDetails}>
                View Plan Details
              </Button>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default SubPlanHistoryModal;

// Exemplo de uso com dados mockados
export function SubPlanHistoryModalDemo() {
  const [open, setOpen] = React.useState(true);
  return (
    <SubPlanHistoryModal
      open={open}
      onClose={() => setOpen(false)}
      onViewDetails={() => alert("View Plan Details clicked!")}
      title="Java Fundamentals - Modification History"
      subtitle="Detailed log of all changes made to this sub-plan"
      events={[
        {
          type: "progress",
          title: "Progress Updated",
          date: "Oct 21, 2023 at 8:10 PM",
          from: "45",
          to: "65",
          reflection: {
            impact: "Completed chapter exercises",
            reason: "Applied new learning strategies",
            effectiveness: "high",
          },
          relativeTime: "over 1 year ago",
        },
        {
          type: "strategy",
          title: "Strategy Changed",
          date: "Oct 19, 2023 at 11:20 AM",
          from: "Pomodoro Technique, Active Recall",
          to: "Pomodoro Technique, Active Recall, Practice Tests",
          reflection: {
            impact: "Added practice tests to improve retention",
            reason: "Needed more hands-on practice",
            effectiveness: "high",
          },
          relativeTime: "over 1 year ago",
        },
        {
          type: "progress",
          title: "Progress Updated",
          date: "Oct 17, 2023 at 5:45 PM",
          from: "30",
          to: "45",
          reflection: {
            impact: "Completed two practice exercises",
            reason: "Dedicated more time to studying",
            effectiveness: "medium",
          },
          relativeTime: "over 1 year ago",
        },
        {
          type: "created",
          title: "Plan Created",
          date: "Oct 15, 2023 at 12:30 PM",
          relativeTime: "over 1 year ago",
        },
      ]}
    />
  );
}
