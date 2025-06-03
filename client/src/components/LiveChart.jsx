// components/LiveChart.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function LiveChart({ title, data, unit }) {
  const formattedData = data.map((value, index) => ({
    name: `T${index + 1}`,
    value,
  }));

  return (
    <div className="bg-white rounded-2xl shadow p-4 w-full">
      <h2 className="text-md font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(val) => `${val} ${unit || ''}`} />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
