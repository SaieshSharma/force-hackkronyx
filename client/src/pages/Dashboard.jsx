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
  const { machineId } = useParams();
  const [currentData, setCurrentData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHours, setSelectedHours] = useState(24);

  const [liveLabels, setLiveLabels] = useState([]);
  const [liveTorqueData, setLiveTorqueData] = useState([]);
  const [liveSpeedData, setLiveSpeedData] = useState([]);
  const [liveWearData, setLiveWearData] = useState([]);
  const [liveTempDiffData, setLiveTempDiffData] = useState([]);
  const [livePowerData, setLivePowerData] = useState([]);

  const fetchLatestData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/machines/${machineId}/latest`);
      const newData = response.data; // Adjusted to match payload structure

      if (!newData) return;

      const newTimestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });

      setLiveLabels((prev) => [...prev.slice(-19), newTimestamp]);
      setLiveTorqueData((prev) => [...prev.slice(-19), newData.torque]);
      setLiveSpeedData((prev) => [...prev.slice(-19), newData.rotationalSpeed]);
      setLiveWearData((prev) => [...prev.slice(-19), newData.toolWear]);
      setLiveTempDiffData((prev) => [...prev.slice(-19), newData.processTemperature - newData.airTemperature]);
      setLivePowerData((prev) => [...prev.slice(-19), (newData.torque * newData.rotationalSpeed) / 9550]);

      setCurrentData(newData);
    } catch (error) {
      console.error("Error fetching latest data:", error);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/machines/${machineId}/history?limit=50&minutes=5`
      );
      setHistoricalData(response.data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/machines/${machineId}/stats?hours=24`
      );
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchLatestData(),
        fetchHistoricalData(),
        fetchStats()
      ]);
      setLoading(false);
    };

    fetchAllData();

    const latestDataInterval = setInterval(fetchLatestData, 5000);
    const historicalDataInterval = setInterval(fetchHistoricalData, 30000);
    const statsInterval = setInterval(fetchStats, 60000);

    return () => {
      clearInterval(latestDataInterval);
      clearInterval(historicalDataInterval);
      clearInterval(statsInterval);
    };
  }, [machineId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading machine data for {machineId}...</p>
        </div>
      </div>
    );
  }

  if (error || !currentData) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error loading data for machine {machineId}</p>
          <p>{error || "Machine not found or no data available"}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const warnings = [];
  if (currentData.torque > 48) warnings.push("⚠️ Torque approaching unsafe levels.");
  if (currentData.toolWear > 200) warnings.push("⚠️ Tool wear high. Consider replacing tool soon.");
  if (currentData.airTemperature > 305) warnings.push("⚠️ Air temperature getting high.");
  if (currentData.processTemperature - currentData.airTemperature < 8) {
    warnings.push("⚠️ Temperature difference too low - check cooling system.");
  }
  if (stats && stats.uptimePercentage < 95) {
    warnings.push(`⚠️ Machine uptime is ${stats.uptimePercentage}% - below target.`);
  }
  if (stats && stats.totalFailures > 5) {
    warnings.push(`⚠️ ${stats.totalFailures} failures detected in the last 24 hours.`);
  }

  return (
    <div className="p-4 space-y-4 bg-gray-100 min-h-screen">
      <Header productQuality={currentData.productQuality} />

      <div className="flex justify-end mb-2">
        <label className="mr-2 font-semibold">Time Range:</label>
        <select
          value={selectedHours}
          onChange={(e) => setSelectedHours(parseInt(e.target.value))}
          className="p-2 rounded border bg-white shadow"
        >
          <option value={1}>Last 1 hour</option>
          <option value={6}>Last 6 hours</option>
          <option value={12}>Last 12 hours</option>
          <option value={24}>Last 24 hours</option>
          <option value={48}>Last 48 hours</option>
        </select>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <MetricCard title="Air Temp" value={currentData.airTemperature} unit="K" subtitle={stats ? `Avg: ${stats.avgAirTemp?.toFixed(1)}K` : ''} />
        <MetricCard title="Proc Temp" value={currentData.processTemperature} unit="K" subtitle={stats ? `Avg: ${stats.avgProcessTemp?.toFixed(1)}K` : ''} />
        <MetricCard title="Torque" value={currentData.torque} unit="Nm" subtitle={stats ? `Max: ${stats.maxTorque?.toFixed(1)}Nm` : ''} />
        <MetricCard title="Speed" value={currentData.rotationalSpeed} unit="rpm" subtitle={stats ? `Avg: ${stats.avgSpeed?.toFixed(0)}rpm` : ''} />
        <MetricCard title="Tool Wear" value={currentData.toolWear} unit="min" subtitle={stats ? `Max: ${stats.maxToolWear?.toFixed(0)}min` : ''} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <LiveChart title="Live Torque" data={liveTorqueData} labels={liveLabels} />
        <LiveChart title="Live Speed" data={liveSpeedData} labels={liveLabels} />
        <LiveChart title="Live Tool Wear" data={liveWearData} labels={liveLabels} />
        <LiveChart title="Live Temp Difference" data={liveTempDiffData} labels={liveLabels} />
        <LiveChart title="Live Power Consumption" data={livePowerData} labels={liveLabels} />
      </div>

      <WarningsPanel warnings={warnings} />
      <StatusCard isFailure={currentData.machineFailure === 1} />
    </div>
  );
}
