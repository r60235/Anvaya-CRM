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
    closedCount: 0,
    pipelineCount: 0,
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
      
      const [closedByAgent, allLeads] = await Promise.all([
        reportsAPI.getClosedByAgent().catch(() => []),
        leadsAPI.getAll().catch(() => [])
      ]);

      // Calculate status distribution from all leads (client-side)
      const statusDistribution = LEAD_STATUSES.map(status => ({
        status,
        count: allLeads.filter(lead => lead.status === status).length
      }));

      // Calculate closed and pipeline counts
      const closedCount = allLeads.filter(lead => lead.status === 'Closed').length;
      const pipelineCount = allLeads.filter(lead => lead.status !== 'Closed').length;

      setReportData({
        closedCount,
        pipelineCount,
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

  // Closed vs Pipeline Pie Chart
  const closedVsPipelineData = {
    labels: ['Closed', 'In Pipeline'],
    datasets: [
      {
        label: 'Leads',
        data: [reportData.closedCount, reportData.pipelineCount],
        backgroundColor: ['#10b981', '#3b82f6'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Closed by Agent Bar Chart
  const closedByAgentData = {
    labels: reportData.closedByAgent.map(item => item.agentName || 'Unknown'),
    datasets: [
      {
        label: 'Closed Leads',
        data: reportData.closedByAgent.map(item => item.closedCount || 0),
        backgroundColor: '#3b82f6',
        borderRadius: 6,
      },
    ],
  };

  // Status Distribution Bar Chart
  const statusDistributionData = {
    labels: reportData.statusDistribution.map(item => item.status || 'Unknown'),
    datasets: [
      {
        label: 'Leads',
        data: reportData.statusDistribution.map(item => item.count || 0),
        backgroundColor: reportData.statusDistribution.map(item => STATUS_COLORS[item.status] || '#6b7280'),
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
      </div>

      <div className="reports-grid">
        {/* Total Leads Closed and in Pipeline - Pie Chart */}
        <div className="report-card chart-card">
          <h3>Total Leads: Closed and in Pipeline</h3>
          <div className="chart-wrapper">
            <Pie 
              data={closedVsPipelineData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 15,
                      font: {
                        size: 12,
                      },
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                },
              }}
            />
          </div>
        </div>

        {/* Leads Closed by Sales Agent - Bar Chart */}
        {reportData.closedByAgent.length > 0 && (
          <div className="report-card chart-card">
            <h3>Leads Closed by Sales Agent</h3>
            <div className="chart-wrapper">
              <Bar 
                data={closedByAgentData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `Closed: ${context.parsed.y} leads`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Lead Status Distribution - Bar Chart */}
        {reportData.statusDistribution.length > 0 && (
          <div className="report-card chart-card">
            <h3>Lead Status Distribution</h3>
            <div className="chart-wrapper">
              <Bar 
                data={statusDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ${context.parsed.y} leads`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
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