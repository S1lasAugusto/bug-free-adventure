import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/router";
import { Brain, BookOpen, Target, Clock } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RegulaProps {}

export function Regula() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/regula");
  };

  return (
    <Card
      className="group relative w-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Brain className="h-6 w-6 text-blue-600" />
            Regula
          </CardTitle>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            Active
          </span>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Manage your learning autonomously and efficiently with
            self-regulation tools.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">
                Study Plan
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Goals</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">
                Progress
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">
                Strategies
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Click to access</span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
              New
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Regula;
