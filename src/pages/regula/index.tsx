import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudyPlan } from "@/components/regula/StudyPlan";
import { GradeSelection } from "@/components/regula/GradeSelection";

export default function RegulaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasSelectedGrade, setHasSelectedGrade] = useState(false);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const handleGradeSelect = (grade: string) => {
    // TODO: Save grade selection to database
    setHasSelectedGrade(true);
  };

  if (!hasSelectedGrade) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <GradeSelection onSelect={handleGradeSelect} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">
        Regula - Self-Regulated Learning
      </h1>
      <Tabs defaultValue="study-plan" className="space-y-4">
        <TabsList>
          <TabsTrigger value="study-plan">Study Plan</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="study-plan">
          <StudyPlan />
        </TabsContent>
        <TabsContent value="progress">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-xl font-semibold">
              Progress Visualization
            </h2>
            <p>Under development...</p>
          </div>
        </TabsContent>
        <TabsContent value="resources">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-xl font-semibold">Study Resources</h2>
            <p>Under development...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
