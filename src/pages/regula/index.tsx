import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudyPlan } from "@/components/regula/StudyPlan";

export default function RegulaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">
        Regula - Aprendizado Autoregulado
      </h1>
      <Tabs defaultValue="study-plan" className="space-y-4">
        <TabsList>
          <TabsTrigger value="study-plan">Plano de Estudos</TabsTrigger>
          <TabsTrigger value="progress">Progresso</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
        </TabsList>
        <TabsContent value="study-plan">
          <StudyPlan />
        </TabsContent>
        <TabsContent value="progress">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-xl font-semibold">
              Visualização de Progresso
            </h2>
            <p>Em desenvolvimento...</p>
          </div>
        </TabsContent>
        <TabsContent value="resources">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-xl font-semibold">Recursos de Estudo</h2>
            <p>Em desenvolvimento...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
