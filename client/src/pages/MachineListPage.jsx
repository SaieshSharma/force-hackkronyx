import React from "react";
import MachineCard from "../components/MachineCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const dummyMachines = [
  {
    id: "M1",
    name: "Hydraulic Press 1",
    airTemp: 301,
    toolWear: 215,
    failure: false,
  },
  {
    id: "M2",
    name: "Lathe Machine 2",
    airTemp: 305,
    toolWear: 222,
    failure: true,
  },
  {
    id: "M3",
    name: "Drill Machine",
    airTemp: 298,
    toolWear: 170,
    failure: false,
  },
];

const MachineListPage = () => {
  const [machineIds, setMachineIds] = useState([]);
  const navigate = useNavigate();

    useEffect(() => {
    const fetchMachineIds = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/machines");
        setMachineIds(res.data);
      } catch (err) {
        console.error("Failed to load machine list:", err);
      }
    };

    fetchMachineIds();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">🏭 Machines List</h1>
      {machineIds.length === 0 ? (
        <p>Loading machines...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {machineIds.map((id) => (
            <div
              key={id}
              className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer transition"
              onClick={() => navigate(`/dashboard/${id}`)}
            >
              <h2 className="text-lg font-medium">Machine: {id}</h2>
              <p className="text-gray-500">Click to view dashboard</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MachineListPage;
