import React from "react";
import { Brain, BookOpen, Target, Clock } from "lucide-react";

export default function RegulaPreview() {
  return (
    <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-bold text-gray-800">Regula</span>
        </div>
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
          Active
        </span>
      </div>

      <p className="mb-3 text-xs text-gray-600">
        Manage your learning autonomously with self-regulation tools.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1 rounded bg-gray-50 p-1.5">
          <BookOpen className="h-3 w-3 text-blue-600" />
          <span className="text-xs font-medium text-gray-700">Study Plan</span>
        </div>
        <div className="flex items-center gap-1 rounded bg-gray-50 p-1.5">
          <Target className="h-3 w-3 text-blue-600" />
          <span className="text-xs font-medium text-gray-700">Goals</span>
        </div>
        <div className="flex items-center gap-1 rounded bg-gray-50 p-1.5">
          <Clock className="h-3 w-3 text-blue-600" />
          <span className="text-xs font-medium text-gray-700">Progress</span>
        </div>
        <div className="flex items-center gap-1 rounded bg-gray-50 p-1.5">
          <Brain className="h-3 w-3 text-blue-600" />
          <span className="text-xs font-medium text-gray-700">Strategies</span>
        </div>
      </div>

      <div className="mt-3 flex justify-center">
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
          New Feature
        </span>
      </div>
    </div>
  );
}
