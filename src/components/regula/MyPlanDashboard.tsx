import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, BookOpen, BadgeCheck } from "lucide-react";
import { SubPlanWizard } from "./SubPlanWizard";
import Link from "next/link";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

interface SubPlan {
  id: string;
  name: string;
  topic: string;
  mastery: number;
  status: string;
  createdAt: string;
  selectedDays: string[];
  selectedStrategies: string[];
  customStrategies: any;
  hoursPerDay: number;
}

export function MyPlanDashboard() {
  const [selectedTab, setSelectedTab] = useState("All Plans");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Verificar o estado da sessão
  const { data: sessionData, status: sessionStatus } = useSession();
  console.log("[CLIENT] Estado da sessão:", sessionStatus);
  console.log("[CLIENT] Dados da sessão:", sessionData);

  // Consultas tRPC
  const {
    data: subPlans = [],
    refetch: refetchSubPlans,
    isError: isLoadError,
    error: loadError,
    isLoading: isLoadingPlans,
    isFetching: isFetchingPlans,
  } = api.subplanRouter.getAll.useQuery(undefined, {
    enabled: sessionStatus === "authenticated",
    retry: 1,
    onSuccess: (data) => {
      console.log("[CLIENT] SubPlans carregados com sucesso:", data);
    },
    onError: (error) => {
      console.error("[CLIENT] Erro ao carregar subplans:", error);
      console.error("[CLIENT] Mensagem de erro:", error.message);
      console.error("[CLIENT] Dados do erro:", error);
    },
  });

  const createSubPlanMutation = api.subplanRouter.create.useMutation({
    onMutate: (variables) => {
      console.log("[CLIENT] Iniciando mutação com variáveis:", variables);
    },
    onSuccess: (data) => {
      console.log("[CLIENT] SubPlan criado com sucesso:", data);
      refetchSubPlans();
      toast.success("SubPlan criado com sucesso!");
    },
    onError: (error) => {
      console.error("[CLIENT] Erro ao criar subplan:", error);
      console.error("[CLIENT] Mensagem de erro:", error.message);
      console.error("[CLIENT] Dados do erro:", error);
      toast.error(`Erro ao criar subplan: ${error.message}`);
    },
  });

  // Query de teste
  const testQuery = api.subplanRouter.test.useQuery(undefined, {
    enabled: false, // Não executar automaticamente
    onSuccess: (data) => {
      console.log("[CLIENT] Teste bem-sucedido:", data);
      setTestResult(JSON.stringify(data, null, 2));
      toast.success("Teste de comunicação com sucesso!");
    },
    onError: (error) => {
      console.error("[CLIENT] Erro no teste:", error);
      setTestResult(`ERRO: ${error.message}`);
      toast.error("Falha na comunicação com o servidor");
    },
  });

  // Função para executar o teste
  const handleTestConnection = () => {
    console.log("[CLIENT] Executando teste de conexão...");
    setTestResult("Aguardando resposta...");
    testQuery.refetch().catch((err) => {
      console.error("[CLIENT] Erro ao executar refetch do teste:", err);
      setTestResult(`ERRO DE EXECUÇÃO: ${err.message}`);
    });
  };

  // Log de informações de estado
  useEffect(() => {
    console.log("[CLIENT] Status de carregamento:", {
      isLoadingPlans,
      isFetchingPlans,
      sessionStatus,
      hasSession: !!sessionData,
    });
  }, [isLoadingPlans, isFetchingPlans, sessionStatus, sessionData]);

  // Log de debug para sessão via API
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Verificar status da sessão
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        console.log("[CLIENT] API Session check:", session);
        if (!session || !session.user) {
          console.warn("[CLIENT] Usuário não autenticado na API de sessão");
        } else {
          console.log("[CLIENT] ID do usuário na sessão:", session.user.id);
        }
      } catch (err) {
        console.error("[CLIENT] Erro ao verificar sessão:", err);
      }
    };

    fetchSession();
  }, []);

  if (isLoadError) {
    console.error("[CLIENT] Erro na consulta getAll:", loadError);
  }

  // Filtrar os subplans com base na aba selecionada
  const filteredSubPlans =
    selectedTab === "All Plans"
      ? subPlans
      : subPlans.filter((sp) =>
          selectedTab === "Active"
            ? sp.status === "Active"
            : sp.status === "Completed"
        );

  // Função para criar um novo subplan usando a API tRPC
  function handleCreateSubPlan(data: any) {
    // Log inicial para confirmar que a função está sendo chamada
    console.log("=============================================");
    console.log("[CLIENT] *** FUNÇÃO handleCreateSubPlan INICIADA ***");
    console.log("[CLIENT] handleCreateSubPlan - DADOS RECEBIDOS:", data);
    console.log("=============================================");

    // Verificação básica de login
    if (!sessionData?.user) {
      console.error("[CLIENT] handleCreateSubPlan - Sem usuário na sessão");
      toast.error("Você precisa estar logado para criar um subplan");
      return;
    }

    // Verificação básica de dados
    if (!data || !data.topic) {
      console.error("[CLIENT] handleCreateSubPlan - Dados inválidos:", data);
      toast.error("Dados inválidos para criar subplan");
      return;
    }

    try {
      setIsLoading(true);

      // Preparar dados super simplificados para teste
      const subplanMinimal = {
        name: data.topic,
        topic: data.topic,
        mastery: data.mastery || 0,
        selectedDays: Array.isArray(data.selectedDays) ? data.selectedDays : [],
        selectedStrategies: Array.isArray(data.selectedStrategies)
          ? data.selectedStrategies
          : [],
        // Usar undefined ao invés de null para customStrategies
        customStrategies: data.customStrategies || undefined,
        hoursPerDay: data.hoursPerDay || 1,
        status: "Active",
      };

      console.log(
        "[CLIENT] handleCreateSubPlan - Dados preparados:",
        subplanMinimal
      );

      // Chamar mutação com menos manipulação possível
      createSubPlanMutation.mutate(subplanMinimal);
      console.log("[CLIENT] handleCreateSubPlan - Mutação chamada");

      // Mostrar mensagem de sucesso
      toast.success("Solicitação de criação enviada!");
    } catch (error) {
      console.error("[CLIENT] handleCreateSubPlan - Erro na execução:", error);
      toast.error("Erro ao processar solicitação");
    } finally {
      // Sempre fechar o wizard e limpar estado
      setIsLoading(false);
      setWizardOpen(false);
    }
  }

  // Função para testar a criação direta de um subplan
  const handleCreateTestSubplan = () => {
    console.log("[CLIENT] *** BOTÃO DE TESTE - Criando subplan de teste ***");

    if (!sessionData?.user) {
      toast.error("Você precisa estar logado");
      return;
    }

    // Dados mínimos para teste
    const testData = {
      name: "Teste " + new Date().toLocaleTimeString(),
      topic: "Teste de API",
      mastery: 10,
      selectedDays: ["Monday"],
      selectedStrategies: ["test"],
      hoursPerDay: 1,
      status: "Active",
    };

    console.log("[CLIENT] Dados de teste:", testData);

    // Usar o método simplificado para chamar a API
    createSubPlanMutation.mutate(testData);
    toast.success("Solicitação de teste enviada!");
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Logging para depurar */}
      <div style={{ display: "none" }}>
        DEBUG: handleCreateSubPlan={typeof handleCreateSubPlan}
      </div>

      <SubPlanWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={(data) => {
          console.log(
            "[CLIENT] MyPlanDashboard.onComplete - INVOCADO COM:",
            data
          );
          handleCreateSubPlan(data);
        }}
      />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Plans</h1>
          <p className="mt-1 text-gray-500">
            View and manage your study plans.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            className="text-sm"
          >
            Testar API
          </Button>
          <Button
            variant="outline"
            onClick={handleCreateTestSubplan}
            className="text-sm"
          >
            Criar SubPlan Teste
          </Button>
          <Button
            className="h-10 px-5 text-base font-semibold"
            onClick={() => setWizardOpen(true)}
            disabled={isLoading}
          >
            <Plus className="mr-2 h-5 w-5" /> New Sub-Plan
          </Button>
        </div>
      </div>

      {/* Área de resultado do teste */}
      {testResult && (
        <div className="mb-4 rounded-lg border bg-gray-50 p-4">
          <h3 className="mb-2 font-medium">Resultado do Teste:</h3>
          <pre className="max-h-40 overflow-auto rounded-md bg-gray-100 p-2 text-xs">
            {testResult}
          </pre>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {["All Plans", "Active", "Completed"].map((tab) => (
          <button
            key={tab}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedTab === tab
                ? "bg-blue-600 text-white shadow"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* General Plan Card */}
      <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <div>
              <div className="text-lg font-bold">My Study Plan</div>
              <div className="text-sm text-gray-500">
                Not set • Target: Not set
              </div>
              <div className="text-sm text-gray-400">
                {subPlans.length === 0
                  ? "Create your first sub-plan to get started"
                  : `${subPlans.length} sub-plan${
                      subPlans.length === 1 ? "" : "s"
                    } created`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              Active
            </span>
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="mt-4 text-sm font-medium text-gray-500">
          Sub-Plans ({subPlans.length})
        </div>
      </div>

      {/* Sub-Plans Grid */}
      {isLoading ? (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <h3 className="mb-1 text-sm font-medium text-gray-900">
            Carregando...
          </h3>
        </div>
      ) : subPlans.length === 0 ? (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <BookOpen className="mb-2 h-8 w-8 text-gray-400" />
          <h3 className="mb-1 text-sm font-medium text-gray-900">
            No sub-plans yet
          </h3>
          <p className="text-sm text-gray-500">
            Create your first sub-plan to start tracking your progress
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubPlans.map((sp) => (
            <div
              key={sp.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="text-base font-semibold">{sp.name}</div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    sp.status === "Active"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {sp.status}
                </span>
                <MoreVertical className="ml-1 h-5 w-5 text-gray-400" />
              </div>
              <div className="mb-1 text-xs text-gray-400">
                {new Date(sp.createdAt).toLocaleDateString()}
              </div>
              <div className="mb-1 flex items-center gap-1 text-sm text-gray-500">
                <BadgeCheck className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Topic:</span>
                <span className="ml-1 font-semibold text-gray-700">
                  {sp.topic}
                </span>
              </div>
              <div className="mb-2 flex items-center gap-1 text-sm text-gray-500">
                <span className="font-medium">Mastery:</span>
                <span className="ml-1 font-semibold text-blue-700">
                  {sp.mastery}%
                </span>
              </div>
              <div className="mb-3 h-2 w-full rounded-full bg-zinc-100">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${sp.mastery}%` }}
                />
              </div>
              <Link href={`/plan/${sp.id}`} className="block w-full">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPlanDashboard;
