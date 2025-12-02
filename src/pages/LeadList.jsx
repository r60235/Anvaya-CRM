// src/pages/LeadList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLeads } from '../hooks/useLeads';
import { useFilters } from '../hooks/useFilters';
import { PRIORITY_ORDER } from '../utils/constants';
import LeadCard from '../components/LeadCard';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner'; 
import ErrorMessage from '../components/ErrorMessage';

const LeadList = () => {
  const { filters, setFilters } = useFilters();
  const { leads, loading, error, fetchLeads } = useLeads();
  const [sortedLeads, setSortedLeads] = useState([]);

  useEffect(() => {
    console.log('LeadList: Filters changed, fetching leads with:', filters);
    console.log('LeadList: Filter keys:', Object.keys(filters));
    fetchLeads(filters);
  }, [filters]); // Fetch whenever filters change

  useEffect(() => {
    // Apply sorting
    let sorted = [...leads];
    
    if (filters.sortBy) {
      sorted.sort((a, b) => {
        const { sortBy, sortOrder } = filters;
        
        if (sortBy === 'priority') {
          const orderA = PRIORITY_ORDER[a.priority] || 999;
          const orderB = PRIORITY_ORDER[b.priority] || 999;
          return sortOrder === 'desc' ? orderB - orderA : orderA - orderB;
        }
        
        if (sortBy === 'timeToClose') {
          return sortOrder === 'desc' 
            ? b.timeToClose - a.timeToClose 
            : a.timeToClose - b.timeToClose;
        }
        
        if (sortBy === 'name') {
          return sortOrder === 'desc'
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name);
        }
        
        if (sortBy === 'createdAt') {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        }
        
        return 0;
      });
    }
    
    setSortedLeads(sorted);
  }, [leads, filters.sortBy, filters.sortOrder]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading && leads.length === 0) {
    return <LoadingSpinner size="large" message="Loading leads..." fullScreen />;
  }

  return (
    <div className="lead-list-page">
      <div className="page-header">
        <h1>All Leads</h1>
        <Link to="/leads/new" className="btn-primary">
          + Add New Lead
        </Link>
      </div>


      <FilterBar 
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => fetchLeads(filters)}
        />
      )}

      {loading && leads.length > 0 && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <LoadingSpinner size="small" message="Updating..." />
        </div>
      )}

      {!loading && sortedLeads.length === 0 ? (
        <div className="empty-state">
          <p>No leads found matching your filters.</p>
          <button 
            onClick={() => setFilters({})} 
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="results-info">
            <p>Showing {sortedLeads.length} lead{sortedLeads.length !== 1 ? 's' : ''}</p>
            {/* Debug info */}
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Active Filters: {JSON.stringify(filters)}
            </p>
          

          </div>
          <div className="leads-grid">
            {sortedLeads.map(lead => (
              <LeadCard key={lead._id || lead.id} lead={lead} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LeadList;
