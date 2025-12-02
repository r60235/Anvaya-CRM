// src/hooks/useAgents.jsx
import { useState } from 'react';
import { agentsAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import { NOTIFICATION_TYPES } from '../utils/constants';

// Custom hook for agent operations
export const useAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addNotification, addAgent: addAgentToContext, fetchAgents: fetchAgentsFromContext } = useApp();

  // Fetch all agents
  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const agentsData = await agentsAPI.getAll();
      setAgents(Array.isArray(agentsData) ? agentsData : []);
      return agentsData;
    } catch (err) {
      const errorMessage = err.normalized?.message || 'Failed to fetch agents';
      setError(errorMessage);
      console.error('Error fetching agents:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new agent
  const createAgent = async (agentData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use AppContext's addAgent to update global state
      const newAgent = await addAgentToContext(agentData);
      setAgents(prev => [...prev, newAgent]);
      return newAgent;
    } catch (err) {
      const errorMessage = err.normalized?.message || 'Failed to create agent';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refetch agents
  const refetch = () => {
    return fetchAgents();
  };

  return {
    agents,
    loading,
    error,
    fetchAgents,
    createAgent,
    refetch
  };
};

export default useAgents;
