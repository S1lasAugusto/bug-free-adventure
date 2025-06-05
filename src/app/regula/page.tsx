"use client";

import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function RegulaPage() {
  const [testResult, setTestResult] = useState<any>(null);

  const testQuery = api.generalPlanRouter.get.useQuery(undefined, {
    onSuccess: (data) => {
      console.log("Teste sucesso:", data);
      setTestResult(data);
    },
    onError: (err) => {
      console.error("Teste erro:", err);
      setTestResult(err);
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Teste GeneralPlan</h1>

      <div className="space-y-4">
        <div>
          <p>Status: {testQuery.status}</p>
          <p>Loading: {testQuery.isLoading ? "Sim" : "Não"}</p>
          <p>Error: {testQuery.error?.message || "Nenhum"}</p>
        </div>

        <div className="rounded bg-gray-100 p-4">
          <h2 className="mb-2 font-bold">Resultado:</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
