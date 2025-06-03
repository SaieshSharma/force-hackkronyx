import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card"; // if using shadcn
import { AlertTriangle, CheckCircle } from "lucide-react";

const MachineCard = ({ machine }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/machine/${machine.id}`)}
      className="cursor-pointer hover:shadow-lg transition p-4 rounded-2xl bg-white"
    >
      <CardContent>
        <div className="text-xl font-semibold">{machine.name}</div>
        <div className="text-gray-500 text-sm">ID: {machine.id}</div>
        <div className="mt-2 text-sm">
          <strong>Air Temp:</strong> {machine.airTemp} K<br />
          <strong>Tool Wear:</strong> {machine.toolWear} min
        </div>
        <div className="mt-2 flex items-center space-x-2">
          {machine.failure ? (
            <>
              <AlertTriangle className="text-red-500" />
              <span className="text-red-600 font-medium">Failure Detected</span>
            </>
          ) : (
            <>
              <CheckCircle className="text-green-500" />
              <span className="text-green-600 font-medium">Healthy</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineCard;
