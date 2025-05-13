import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface RegulaProps {
  // Props serão adicionadas conforme necessário
}

export const Regula: React.FC<RegulaProps> = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Regula</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Conteúdo do componente Regula será adicionado aqui.</p>
      </CardContent>
    </Card>
  );
};

export default Regula;
