// LiveChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LiveChart = ({ title, data, labels }) => {
  const chartData = labels.map((label, index) => ({
    time: label,
    value: data[index],
  }));

  return (
    <div className="bg-white p-4 rounded shadow w-full">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} animationDuration={300} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveChart;
