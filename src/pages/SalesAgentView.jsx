import React, { useState, useEffect } from 'react';
import { useLeads } from '../hooks/useLeads';
import { useApp } from '../context/AppContext';
import LeadCard from '../components/LeadCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const SalesAgentView = () => {
  const { leads, loading, error, fetchLeads } = useLeads();
  const { agents } = useApp();
  const [groupedLeads, setGroupedLeads] = useState({});

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const grouped = {};
    agents.forEach(agent => {
      const agentId = agent._id || agent.id;
      grouped[agentId] = {
        agent,
        leads: leads.filter(lead => 
          (lead.salesAgent?._id || lead.salesAgent?.id || lead.salesAgent) === agentId
        )
      };
    });
    setGroupedLeads(grouped);
  }, [leads, agents]);

  if (loading) {
    return <LoadingSpinner size="large" message="Loading leads..." fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchLeads} type="banner" />;
  }

  return (
    <div className="agent-view-page">
      <div className="page-header">
        <h1>Leads by Sales Agent</h1>
      </div>

      <div className="agent-sections">
        {Object.values(groupedLeads).map(({ agent, leads: agentLeads }) => (
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
