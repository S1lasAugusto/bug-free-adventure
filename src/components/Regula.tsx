import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/router";
import { StudyPlan } from "./regula/StudyPlan";

interface RegulaProps {
  // Props serão adicionadas conforme necessário
}

export function Regula() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/regula");
  };

  return (
    <Card
      className="w-full cursor-pointer transition-shadow hover:shadow-md"
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle>Regula</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Clique para acessar o componente de Aprendizado Autoregulado.</p>
      </CardContent>
    </Card>
  );
}

export default Regula;
