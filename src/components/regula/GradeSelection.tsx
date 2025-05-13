import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";

interface GradeSelectionProps {
  onSelect: (grade: string) => void;
}

const grades = [
  { value: "A", range: "90-100%", description: "Excellent" },
  { value: "B", range: "80-89%", description: "Good" },
  { value: "C", range: "70-79%", description: "Satisfactory" },
  { value: "D", range: "60-69%", description: "Passing" },
  { value: "E", range: "50-59%", description: "Minimum Passing" },
];

export function GradeSelection({ onSelect }: GradeSelectionProps) {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Set Your Course Objective</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-zinc-500">
          Before you begin, please select the target grade you aim to achieve
          for this course. This will help tailor your study plan to meet your
          goals.
        </p>

        <div className="space-y-3">
          {grades.map((grade) => (
            <div
              key={grade.value}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                selectedGrade === grade.value
                  ? "dark:bg-blue-950 border-blue-500 bg-blue-50"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800"
              }`}
              onClick={() => setSelectedGrade(grade.value)}
            >
              <div>
                <h3 className="font-semibold">
                  Grade {grade.value} ({grade.range})
                </h3>
                <p className="text-sm text-zinc-500">{grade.description}</p>
              </div>
              {selectedGrade === grade.value && (
                <div className="h-4 w-4 rounded-full bg-blue-500" />
              )}
            </div>
          ))}
        </div>

        <Button
          className="w-full"
          disabled={!selectedGrade}
          onClick={() => selectedGrade && onSelect(selectedGrade)}
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
