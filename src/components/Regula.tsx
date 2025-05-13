import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/router";

interface RegulaProps {
  // Props serão adicionadas conforme necessário
}

export const Regula: React.FC<RegulaProps> = () => {
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
        <p>Clique para acessar a interface de chat do Regula.</p>
      </CardContent>
    </Card>
  );
};

export default Regula;
