import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { reportsAPI, leadsAPI } from '../services/api';
import { STATUS_COLORS, LEAD_STATUSES } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend 
);
 
const Reports = () => {
  const [reportData, setReportData] = useState({
    lastWeek: [],
    pipeline: null,
    closedByAgent: [],
    statusDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [lastWeek, pipeline, closedByAgent, allLeads] = await Promise.all([
        reportsAPI.getLastWeek().catch(() => []),
        reportsAPI.getPipeline().catch(() => ({ totalLeadsInPipeline: 0 })),
        reportsAPI.getClosedByAgent().catch(() => []),
        leadsAPI.getAll().catch(() => [])
      ]);

      // Calculate status distribution from all leads (client-side)
      const statusDistribution = LEAD_STATUSES.map(status => ({
        status,
        count: allLeads.filter(lead => lead.status === status).length
      }));

      // Calculate pipeline count (all leads that are NOT closed)
      const pipelineCount = allLeads.filter(lead => lead.status !== 'Closed').length;

      setReportData({
        lastWeek: Array.isArray(lastWeek) ? lastWeek : [],
        pipeline: pipelineCount, // Use calculated count
        closedByAgent: Array.isArray(closedByAgent) ? closedByAgent : [],
        statusDistribution: statusDistribution
      });
    } catch (err) {
      setError(err.normalized?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Loading reports..." fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadReports} type="banner" />;
  }

  const lastWeekChartData = {
    labels: reportData.lastWeek.map(lead => lead.name || 'Unknown'),
    datasets: [
      {
        label: 'Leads Closed',
        data: reportData.lastWeek.map((_, index) => 1),
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const closedByAgentData = {
    labels: reportData.closedByAgent.map(item => item.agentName || 'Unknown'),
    datasets: [
      {
        label: 'Closed Leads',
        data: reportData.closedByAgent.map(item => item.closedCount || 0),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      },
    ],
  };

  const statusDistributionData = {
    labels: reportData.statusDistribution.map(item => item.status || 'Unknown'),
    datasets: [
      {
        label: 'Leads',
        data: reportData.statusDistribution.map(item => item.count || 0),
        backgroundColor: reportData.statusDistribution.map(item => STATUS_COLORS[item.status] || '#6b7280'),
      },
    ],
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
      </div>

      <div className="reports-grid">
        {/* Pipeline Metric */}
        <div className="report-card metric-card">
          <h3>Total Leads in Pipeline</h3>
          <div className="metric-value">
            {typeof reportData.pipeline === 'number' 
              ? reportData.pipeline 
              : reportData.pipeline?.totalLeadsInPipeline || 0}
          </div>
          <p className="metric-label">Active Leads</p>
        </div>

        {/* Last Week Chart */}
        {reportData.lastWeek.length > 0 && (
          <div className="report-card chart-card">
            <h3>Leads Closed Last Week</h3>
            <div className="chart-wrapper">
              <Bar 
                data={lastWeekChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Closed by Agent Chart */}
        {reportData.closedByAgent.length > 0 && (
          <div className="report-card chart-card">
            <h3>Closed Leads by Agent</h3>
            <div className="chart-wrapper">
              <Bar 
                data={closedByAgentData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  indexAxis: 'y',
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Status Distribution Chart */}
        {reportData.statusDistribution.length > 0 && (
          <div className="report-card chart-card">
            <h3>Lead Status Distribution</h3>
            <div className="chart-wrapper">
              <Pie 
                data={statusDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;