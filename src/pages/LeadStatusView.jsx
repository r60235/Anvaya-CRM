// src/pages/LeadStatusView.jsx
import React, { useState, useEffect } from 'react';
import { useLeads } from '../hooks/useLeads';
import { LEAD_STATUSES, STATUS_COLORS, PRIORITY_ORDER } from '../utils/constants';
import LeadCard from '../components/LeadCard';
import SimpleFilterBar from '../components/SimpleFilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const LeadStatusView = () => {
  const { leads, loading, error, fetchLeads } = useLeads();
  const [groupedLeads, setGroupedLeads] = useState({});
  const [filters, setFilters] = useState({
    salesAgent: '',
    priority: '',
    sortBy: 'timeToClose',
    sortOrder: 'asc'
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    // Filter leads
    let filteredLeads = [...leads];
    
    if (filters.salesAgent) {
      filteredLeads = filteredLeads.filter(lead => 
        (lead.salesAgent?._id || lead.salesAgent?.id || lead.salesAgent) === filters.salesAgent
      );
    }
    
    if (filters.priority) {
      filteredLeads = filteredLeads.filter(lead => lead.priority === filters.priority);
    }
    
    // Sort leads by time to close
    filteredLeads.sort((a, b) => {
      if (filters.sortBy === 'timeToClose') {
        return filters.sortOrder === 'asc' 
          ? a.timeToClose - b.timeToClose 
          : b.timeToClose - a.timeToClose;
      }
      return 0;
    });
    
    // Group by status
    const grouped = {};
    LEAD_STATUSES.forEach(status => {
      grouped[status] = filteredLeads.filter(lead => lead.status === status);
    });
    setGroupedLeads(grouped);
  }, [leads, filters]);

  if (loading) {
    return <LoadingSpinner size="large" message="Loading leads..." fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchLeads} type="banner" />;
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="status-view-page">
      <div className="page-header">
        <h1>Leads by Status</h1>
      </div>

      <SimpleFilterBar 
        onFilterChange={handleFilterChange}
        initialFilters={filters}
        showAgentFilter={true}
      />

      <div className="status-columns">
        {LEAD_STATUSES
          .sort((statusA, statusB) => {
            // Sort statuses by minimum time to close in their leads
            const leadsA = groupedLeads[statusA] || [];
            const leadsB = groupedLeads[statusB] || [];
            const minTimeA = leadsA.length > 0 ? Math.min(...leadsA.map(l => l.timeToClose)) : Infinity;
            const minTimeB = leadsB.length > 0 ? Math.min(...leadsB.map(l => l.timeToClose)) : Infinity;
            return filters.sortOrder === 'asc' ? minTimeA - minTimeB : minTimeB - minTimeA;
          })
          .map(status => (
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
