import { NextPage } from "next/types";
import { useAuth } from "../contexts/AuthContext";
import SelectedComponentsContainer from "../components/SelectedComponentsContainer";
import UIOnboarding from "../components/onboarding/UIOnboarding";
import { api } from "../utils/api";

const Dashboard: NextPage = () => {
  const { user, isLoading: authLoading } = useAuth();

  const {
    data: userPreferences,
    isSuccess: selectedSuccess,
    isLoading: selectedLoading,
    error,
  } = api.userRouter.getUserPreferences.useQuery(undefined, {
    enabled: !!user && user.onBoarded,
  });

  console.log("Dashboard Debug:", {
    user,
    userPreferences,
    selectedSuccess,
    selectedLoading,
    error,
  });

  if (authLoading || selectedLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Se o usuário não completou o onboarding, mostrar o componente de onboarding
  if (user && !user.onBoarded) {
    return <UIOnboarding />;
  }

  if (error || !selectedSuccess) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">
            Erro ao carregar preferências: {error?.message}
          </p>
          <p className="text-gray-500">
            Verifique se você completou o onboarding
          </p>
          {error?.message?.includes("Usuário não encontrado") && (
            <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                🔄 Parece que sua sessão expirou ou o banco foi resetado.
                <br />
                <button
                  onClick={() => {
                    localStorage.removeItem("auth-token");
                    window.location.reload();
                  }}
                  className="mt-2 rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                >
                  Fazer Login Novamente
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="background-color rounded-r-lg">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <SelectedComponentsContainer
          selected={userPreferences?.selectedComponents || []}
          leaderboard={userPreferences?.leaderboard || false}
        />
      </div>
    </div>
  );
};

export default Dashboard;
