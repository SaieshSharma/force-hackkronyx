import React from "react";
export default function StatusCard({ isFailure }) {
  return (
    <div
      className={`p-4 rounded-2xl text-center font-semibold text-lg shadow ${
        isFailure ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
      }`}
    >
      Machine Status: {isFailure ? "❌ Failure Detected" : "✅ OK"}
    </div>
  );
}