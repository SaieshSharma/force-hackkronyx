import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import MetricCard from "../components/MetricCard";
import LiveChart from "../components/LiveChart";
import WarningsPanel from "../components/WarningsPanel";
import StatusCard from "../components/StatusCard";
import axios from "axios";

export default function Dashboard() {
  const { machineId } = useParams(); // /dashboard/:machineId
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/machines/${machineId}/latest`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching machine data:", error);
      }
    };

    fetchLatestData();

    const interval = setInterval(fetchLatestData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [machineId]);

  if (!data) return <p>Loading latest data for machine {machineId}...</p>;

  // Generate warnings based on real data
  const warnings = [];
  if (data.torque > 48) warnings.push("⚠️ Torque approaching unsafe levels.");
  if (data.toolWear > 200) warnings.push("⚠️ Tool wear high. Consider replacing tool soon.");
  if (data.airTemperature > 305) warnings.push("⚠️ Air temperature getting high.");
  if (data.processTemperature - data.airTemperature < 8) warnings.push("⚠️ Temperature difference too low.");

  // Create dummy chart data (you'll want to replace this with historical data from your API)
  const dummyChartData = {
    torqueData: [data.torque - 2, data.torque - 1, data.torque, data.torque + 1, data.torque - 0.5],
    speedData: [data.rotationalSpeed - 20, data.rotationalSpeed + 10, data.rotationalSpeed, data.rotationalSpeed - 15, data.rotationalSpeed + 5],
    wearData: [data.toolWear - 10, data.toolWear - 5, data.toolWear, data.toolWear + 2, data.toolWear + 3],
    tempDiffData: [
      data.processTemperature - data.airTemperature - 1,
      data.processTemperature - data.airTemperature + 0.5,
      data.processTemperature - data.airTemperature,
      data.processTemperature - data.airTemperature - 0.3,
      data.processTemperature - data.airTemperature + 0.2
    ],
    powerData: [3600, 3700, 3800, 3750, 3900] // You might want to calculate this or get from API
  };

  return (
    <div className="p-4 space-y-4 bg-gray-100 min-h-screen">
      <Header productQuality={data.productQuality} />
      
      <div className="grid grid-cols-5 gap-4">
        <MetricCard title="Air Temp" value={data.airTemperature} unit="K" />
        <MetricCard title="Proc Temp" value={data.processTemperature} unit="K" />
        <MetricCard title="Torque" value={data.torque} unit="Nm" />
        <MetricCard title="Speed" value={data.rotationalSpeed} unit="rpm" />
        <MetricCard title="Tool Wear" value={data.toolWear} unit="min" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <LiveChart title="Torque Over Time" data={dummyChartData.torqueData} />
        <LiveChart title="Speed Over Time" data={dummyChartData.speedData} />
        <LiveChart title="Tool Wear Trend" data={dummyChartData.wearData} />
        <LiveChart title="Temp Difference Trend" data={dummyChartData.tempDiffData} />
        <LiveChart title="Power Consumption Trend" data={dummyChartData.powerData} />
      </div>

      <WarningsPanel warnings={warnings} />
      <StatusCard isFailure={data.machineFailure === 1} />
    </div>
  );
}