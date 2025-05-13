import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

const RegulaPage: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Regula - Self-Regulated Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="plan" className="w-full">
            <TabsList>
              <TabsTrigger value="plan">Meu Plano</TabsTrigger>
              <TabsTrigger value="progress">Progresso</TabsTrigger>
              <TabsTrigger value="resources">Recursos</TabsTrigger>
            </TabsList>

            <TabsContent value="plan">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Plano de Estudos</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Gerencie seu plano de estudos e acompanhe seu progresso.
                </p>
                {/* Aqui vamos adicionar o componente de plano */}
              </div>
            </TabsContent>

            <TabsContent value="progress">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Progresso</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Visualize seu progresso e estatísticas de estudo.
                </p>
                {/* Aqui vamos adicionar os gráficos de progresso */}
              </div>
            </TabsContent>

            <TabsContent value="resources">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recursos</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Acesse recursos e exercícios para seus estudos.
                </p>
                {/* Aqui vamos adicionar a lista de recursos */}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegulaPage;
