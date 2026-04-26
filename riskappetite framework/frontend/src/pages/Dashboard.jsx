import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

function KPICard({ title, value, color, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${icon.bg}`}>
          {icon.svg}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow h-24"></div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow h-80"></div>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/risks/stats');
      const data = response.data;

      setStats({
        total: data.total || 0,
        high: data.high || 0,
        medium: data.medium || 0,
        low: data.low || 0,
      });

      setChartData(data.byCategory || [
        { category: 'Strategic', count: 0 },
        { category: 'Operational', count: 0 },
        { category: 'Financial', count: 0 },
        { category: 'Compliance', count: 0 },
      ]);
    } catch (err) {
      setStats({ total: 0, high: 0, medium: 0, low: 0 });
      setChartData([
        { category: 'Strategic', count: 0 },
        { category: 'Operational', count: 0 },
        { category: 'Financial', count: 0 },
        { category: 'Compliance', count: 0 },
      ]);
      console.error('Dashboard API not available:', err);
    } finally {
      setLoading(false);
    }
  };

  const kpiIcons = {
    total: {
      bg: 'bg-blue-100',
      svg: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    high: {
      bg: 'bg-red-100',
      svg: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    medium: {
      bg: 'bg-yellow-100',
      svg: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    low: {
      bg: 'bg-green-100',
      svg: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1B4F8A' }}>
          Dashboard
        </h1>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#1B4F8A' }}>
        Dashboard
      </h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button onClick={fetchDashboardData} className="ml-4 underline text-sm">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard title="Total Risks" value={stats.total} color="text-gray-900" icon={kpiIcons.total} />
        <KPICard title="High Priority" value={stats.high} color="text-red-600" icon={kpiIcons.high} />
        <KPICard title="Medium Priority" value={stats.medium} color="text-yellow-600" icon={kpiIcons.medium} />
        <KPICard title="Low Priority" value={stats.low} color="text-green-600" icon={kpiIcons.low} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Risks by Category</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1B4F8A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}