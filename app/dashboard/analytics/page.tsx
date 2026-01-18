'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Map } from 'lucide-react';

interface AnalyticsData {
  droughtStatistics: {
    total_records: number;
    avg_anomaly: number;
    avg_confidence: number;
  };
  severityDistribution: Array<{ severity_level: string; count: number }>;
  alertStatistics: Array<{ status: string; count: number }>;
  topAffectedRegions: any[];
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchAnalytics();
  }, [router, days]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/analytics/report?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const SEVERITY_COLORS: Record<string, string> = {
    none: '#22c55e',
    mild: '#eab308',
    moderate: '#f97316',
    severe: '#ef4444',
    extreme: '#7f1d1d',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader
          title="Analytics & Reports"
          subtitle="Comprehensive drought analysis and insights"
        />
        <div className="text-center py-12">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Analytics & Reports"
        subtitle="Comprehensive drought analysis and insights"
      />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Time Period Selector */}
        <div className="mb-8 flex gap-2">
          {[7, 30, 90, 365].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${days === d
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
            >
              {d} Days
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-3xl font-bold">
                    {data?.droughtStatistics.total_records || 0}
                  </p>
                </div>
                <BarChart3 className="text-indigo-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Anomaly Score</p>
                  <p className="text-3xl font-bold">
                    {((data?.droughtStatistics.avg_anomaly || 0) * 100).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="text-orange-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confidence Level</p>
                  <p className="text-3xl font-bold">
                    {Math.round(data?.droughtStatistics.avg_confidence || 0)}%
                  </p>
                </div>
                <PieChartIcon className="text-green-600" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Severity Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Severity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data?.severityDistribution || []}
                    dataKey="count"
                    nameKey="severity_level"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    {data?.severityDistribution.map((entry) => (
                      <Cell
                        key={entry.severity_level}
                        fill={SEVERITY_COLORS[entry.severity_level] || '#999'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Alert Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.alertStatistics || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Affected Regions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map size={20} />
              Top Affected Regions
            </CardTitle>
            <CardDescription>Regions with highest drought severity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.topAffectedRegions.slice(0, 10).map((region, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: SEVERITY_COLORS[region.severity_level] || '#999',
                      }}
                    />
                    <div>
                      <p className="font-medium">{region.name}</p>
                      <p className="text-sm text-gray-500">
                        {region.readings} readings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {region.severity_level.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(region.anomaly_score * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
