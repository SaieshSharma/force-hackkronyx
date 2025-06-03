import React from "react";
export default function Header({ productQuality }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow">
      <h1 className="text-2xl font-bold">Predictive Maintenance Dashboard</h1>
      <div className="text-sm text-gray-600">
        Product Quality: <span className="font-semibold">{productQuality}</span>
      </div>
    </div>
  );
}
