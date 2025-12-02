import { useState } from 'react';
import { leadsAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import { NOTIFICATION_TYPES } from '../utils/constants';

// Custom hook for lead operations
export const useLeads = (initialFilters = {}) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const { addNotification } = useApp();

  // Fetch leads with current filters
  const fetchLeads = async (newFilters = null) => {
    setLoading(true);
    setError(null);
    
    // Always use the passed filters if provided, otherwise use empty object
    const filtersToUse = newFilters !== null ? newFilters : filters;
    
    console.log('useLeads: fetchLeads called');
    console.log('useLeads: newFilters argument:', newFilters);
    console.log('useLeads: filtersToUse:', filtersToUse);
    console.log('useLeads: Calling API with:', filtersToUse);
    
    try {
      const leadsData = await leadsAPI.getAll(filtersToUse);
      console.log('useLeads: API returned', leadsData.length, 'leads');
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      return leadsData;
    } catch (err) {
      const errorMessage = err.normalized?.message || 'Failed to fetch leads';
      setError(errorMessage);
      console.error('useLeads: Error fetching leads:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new lead
  const createLead = async (leadData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newLead = await leadsAPI.create(leadData);
      setLeads(prev => [newLead, ...prev]);
      addNotification('Lead created successfully', NOTIFICATION_TYPES.SUCCESS);
      return newLead;
    } catch (err) {
      const errorMessage = err.normalized?.message || 'Failed to create lead';
      setError(errorMessage);
      addNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing lead
  const updateLead = async (id, leadData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedLead = await leadsAPI.update(id, leadData);
      setLeads(prev => prev.map(lead => 
        lead._id === id || lead.id === id ? updatedLead : lead
      ));
      addNotification('Lead updated successfully', NOTIFICATION_TYPES.SUCCESS);
      return updatedLead;
    } catch (err) {
      const errorMessage = err.normalized?.message || 'Failed to update lead';
      setError(errorMessage);
      addNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a lead
  const deleteLead = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await leadsAPI.delete(id);
      setLeads(prev => prev.filter(lead => lead._id !== id && lead.id !== id));
      addNotification('Lead deleted successfully', NOTIFICATION_TYPES.SUCCESS);
      return true;
    } catch (err) {
      const errorMessage = err.normalized?.message || 'Failed to delete lead';
      setError(errorMessage);
      addNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refetch leads with current filters
  const refetch = () => {
    return fetchLeads();
  };

  // Update filters and fetch leads
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    return fetchLeads(newFilters);
  };

  return {
    leads,
    loading,
    error,
    filters,
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
    refetch,
    updateFilters
  };
};

export default useLeads;
