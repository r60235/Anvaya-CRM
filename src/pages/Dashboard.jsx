import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import { LEAD_STATUSES, STATUS_COLORS } from '../utils/constants';
import LeadCard from '../components/LeadCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);
 
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const leadsData = await leadsAPI.getAll();
      setLeads(leadsData);
      
      // Calculate status counts
      const counts = {};
      LEAD_STATUSES.forEach(status => {
        counts[status] = leadsData.filter(lead => lead.status === status).length;
      });
      setStatusCounts(counts);
    } catch (err) {
      setError(err.normalized?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return <LoadingSpinner size="large" message="Loading dashboard..." fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadDashboardData} type="banner" />;
  }

  const recentLeads = leads.slice(0, 5);
  const pipelineCount = leads.filter(lead => lead.status !== 'Closed').length;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Anvaya CRM Dashboard</h1>
        <Link to="/leads/new" className="btn-primrigorousary">
          + Add New Lead
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#3b82f6' }}>
            👥
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Leads</p>
            <p className="stat-value">{leads.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f59e0b' }}>
            📈
          </div>
          <div className="stat-content">
            <p className="stat-label">In Pipeline</p>
            <p className="stat-value">{pipelineCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#22c55e' }}>
            ✅
          </div>
          <div className="stat-content">
            <p className="stat-label">Closed</p>
            <p className="stat-value">{statusCounts['Closed'] || 0}</p>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="section">
        <h2 className="section-title">Lead Status Overview</h2>
        <div className="status-cards-grid">
          {LEAD_STATUSES.map(status => (
            <Link
              key={status}
              to={`/leads?status=${encodeURIComponent(status)}`}
              className="status-overview-card"
            >
              <div 
                className="status-indicator"
                style={{ backgroundColor: STATUS_COLORS[status] }}
              />
              <div className="status-info">
                <p className="status-name">{status}</p>
                <p className="status-count">{statusCounts[status] || 0}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Leads */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Recent Leads</h2>
          <Link to="/leads" className="view-all-link">
            View All →
          </Link>
        </div>
        {recentLeads.length > 0 ? (
          <div className="leads-grid">
            {recentLeads.map(lead => (
              <LeadCard key={lead._id || lead.id} lead={lead} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No leads yet. Create your first lead to get started!</p>
            <Link to="/leads/new" className="btn-primary">
              Create Lead
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/leads/new" className="quick-action-card">
            <div className="action-icon">+</div>
            <p>Add New Lead</p>
          </Link>
          <Link to="/leads?status=New" className="quick-action-card">
            <div className="action-icon">📋</div>
            <p>View New Leads</p>
          </Link>
          <Link to="/reports" className="quick-action-card">
            <div className="action-icon">📊</div>
            <p>View Reports</p>
          </Link>
          <Link to="/agents" className="quick-action-card">
            <div className="action-icon">👥</div>
            <p>Manage Agents</p>
          </Link> 
        </div>
      </div>
    </div>
  );
};

export default Dashboard;