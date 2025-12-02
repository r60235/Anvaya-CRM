import React, { useState, useEffect } from 'react';
import { useLeads } from '../hooks/useLeads';
import { useApp } from '../context/AppContext';
import LeadCard from '../components/LeadCard';
import SimpleFilterBar from '../components/SimpleFilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const SalesAgentView = () => {
  const { leads, loading, error, fetchLeads } = useLeads();
  const { agents } = useApp();
  const [groupedLeads, setGroupedLeads] = useState({});
  const [filters, setFilters] = useState({
    status: '',
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
    
    if (filters.status) {
      filteredLeads = filteredLeads.filter(lead => lead.status === filters.status);
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
    
    // Group by agent
    const grouped = {};
    agents.forEach(agent => {
      const agentId = agent._id || agent.id;
      grouped[agentId] = {
        agent,
        leads: filteredLeads.filter(lead => 
          (lead.salesAgent?._id || lead.salesAgent?.id || lead.salesAgent) === agentId
        )
      };
    });
    setGroupedLeads(grouped);
  }, [leads, agents, filters]);

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
    <div className="agent-view-page">
      <div className="page-header">
        <h1>Leads by Sales Agent</h1>
      </div>

      <SimpleFilterBar 
        onFilterChange={handleFilterChange}
        initialFilters={filters}
        showAgentFilter={false}
        showStatusFilter={true}
      />

      <div className="agent-sections">
        {Object.values(groupedLeads)
          .sort((a, b) => {
            // Sort agents by minimum time to close in their leads
            const minTimeA = a.leads.length > 0 ? Math.min(...a.leads.map(l => l.timeToClose)) : Infinity;
            const minTimeB = b.leads.length > 0 ? Math.min(...b.leads.map(l => l.timeToClose)) : Infinity;
            return filters.sortOrder === 'asc' ? minTimeA - minTimeB : minTimeB - minTimeA;
          })
          .map(({ agent, leads: agentLeads }) => (
          <div key={agent._id || agent.id} className="agent-section">
            <div className="agent-section-header">
              <div className="agent-info">
                <div className="agent-avatar-small">
                  {agent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{agent.name}</h3>
                  <p className="agent-email-small">{agent.email}</p>
                </div>
              </div>
              <span className="count-badge">{agentLeads.length} leads</span>
            </div>
            <div className="agent-leads-grid">
              {agentLeads.length > 0 ? (
                agentLeads.map(lead => (
                  <LeadCard key={lead._id || lead.id} lead={lead} />
                ))
              ) : (
                <p className="empty-section">No leads assigned to this agent</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesAgentView;
