import React from "react";

interface SubPlan {
  id: string;
  name: string;
  status: "active" | "completed";
  lastModified: string;
  topic: string;
  changes: number;
}

const mockSubPlans: SubPlan[] = [
  {
    id: "1",
    name: "Java Fundamentals",
    status: "active",
    lastModified: "10/15/2023",
    topic: "Java Fundamentals",
    changes: 4,
  },
  {
    id: "2",
    name: "OOP Concepts",
    status: "active",
    lastModified: "10/10/2023",
    topic: "OOP Concepts",
    changes: 2,
  },
  {
    id: "3",
    name: "Collections",
    status: "completed",
    lastModified: "09/30/2023",
    topic: "Collections",
    changes: 5,
  },
];

export function SubPlanHistory() {
  return (
    <div className="space-y-4">
      {mockSubPlans.map((plan) => (
        <div
          key={plan.id}
          className="mb-2 rounded-lg border bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">{plan.name}</span>
            <span
              className={`ml-2 rounded-full px-3 py-1 text-xs font-semibold ${
                plan.status === "active"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {plan.status}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-500">
            <div>
              <span className="font-medium">Last modified:</span>{" "}
              {plan.lastModified}
            </div>
            <div>
              <span className="font-medium">Topic:</span> {plan.topic}
            </div>
            <div>
              <span className="font-medium">Changes:</span> {plan.changes}{" "}
              records
            </div>
          </div>
          <div className="mt-2">
            <a
              href="#"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Click to view detailed history
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubPlanHistory;
