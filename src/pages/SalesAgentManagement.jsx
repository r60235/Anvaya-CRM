import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAgents } from '../hooks/useAgents';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const SalesAgentManagement = () => {
  const { agents, loading, error, fetchAgents } = useAgents();
 
  useEffect(() => {
    fetchAgents();
  }, []); 

  if (loading) {
    return <LoadingSpinner size="large" message="Loading agents..." fullScreen />;
  }

  return (
    <div className="agents-page">
      <div className="page-header">
        <h1>Sales Agents</h1>
        <Link to="/agents/new" className="btn-primary">
          + Add New Agent
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchAgents} />}

      {agents.length === 0 ? (
        <div className="empty-state">
          <p>No sales agents yet. Add your first agent to get started!</p>
          <Link to="/agents/new" className="btn-primary">
            Add Agent
          </Link>
        </div>
      ) : (
        <div className="agents-grid">
          {agents.map(agent => (
            <div key={agent._id || agent.id} className="agent-card">
              <div className="agent-avatar">
                {agent.name.charAt(0).toUpperCase()}
              </div>
              <div className="agent-info">
                <p className="agent-name-email">
                  <span className="agent-name">{agent.name}</span>
                  <span className="separator"> - </span>
                  <span className="agent-email">{agent.email}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesAgentManagement;
