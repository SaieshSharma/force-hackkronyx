import React from "react";
import { AlertTriangle } from "lucide-react";
export default function WarningsPanel({ warnings }) {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-2xl shadow">
      <div className="flex items-center mb-2">
        <AlertTriangle className="text-yellow-700 mr-2" />
        <h2 className="text-lg font-semibold text-yellow-800">Warnings</h2>
      </div>
      <ul className="list-disc list-inside text-yellow-900">
        {warnings.map((warning, idx) => (
          <li key={idx}>{warning}</li>
        ))}
      </ul>
    </div>
  );
}