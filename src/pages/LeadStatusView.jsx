// src/pages/LeadStatusView.jsx
import React, { useState, useEffect } from 'react';
import { useLeads } from '../hooks/useLeads';
import { LEAD_STATUSES, STATUS_COLORS } from '../utils/constants';
import LeadCard from '../components/LeadCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const LeadStatusView = () => {
  const { leads, loading, error, fetchLeads } = useLeads();
  const [groupedLeads, setGroupedLeads] = useState({});

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const grouped = {};
    LEAD_STATUSES.forEach(status => {
      grouped[status] = leads.filter(lead => lead.status === status);
    });
    setGroupedLeads(grouped);
  }, [leads]);

  if (loading) {
    return <LoadingSpinner size="large" message="Loading leads..." fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchLeads} type="banner" />;
  }

  return (
    <div className="status-view-page">
      <div className="page-header">
        <h1>Leads by Status</h1>
      </div>

      <div className="status-columns">
        {LEAD_STATUSES.map(status => (
          <div key={status} className="status-column">
            <div 
              className="status-column-header"
              style={{ borderTopColor: STATUS_COLORS[status] }}
            >
              <h3>{status}</h3>
              <span className="count-badge">{groupedLeads[status]?.length || 0}</span>
            </div>
            <div className="status-column-content">
              {groupedLeads[status]?.length > 0 ? (
                groupedLeads[status].map(lead => (
                  <LeadCard key={lead._id || lead.id} lead={lead} />
                ))
              ) : (
                <p className="empty-column">No leads in this status</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadStatusView;
