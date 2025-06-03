
import React from "react";
export default function MetricCard({ title, value, unit }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold">
        {value} <span className="text-sm">{unit}</span>
      </p>
    </div>
  );
}
