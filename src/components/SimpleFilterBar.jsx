// src/components/SimpleFilterBar.jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LEAD_PRIORITIES, LEAD_STATUSES, SORT_ORDER } from '../utils/constants';
import '../styles/FilterBar.css';

// Simplified filter bar for StatusView and AgentView pages
const SimpleFilterBar = ({ onFilterChange, initialFilters = {}, showAgentFilter = true, showStatusFilter = false }) => {
  const { agents } = useApp();
  const [filters, setFilters] = useState({
    salesAgent: initialFilters.salesAgent || '',
    status: initialFilters.status || '',
    priority: initialFilters.priority || '',
    sortBy: initialFilters.sortBy || 'timeToClose',
    sortOrder: initialFilters.sortOrder || SORT_ORDER.ASC
  });

  useEffect(() => {
    setFilters({
      salesAgent: initialFilters.salesAgent || '',
      status: initialFilters.status || '',
      priority: initialFilters.priority || '',
      sortBy: initialFilters.sortBy || 'timeToClose',
      sortOrder: initialFilters.sortOrder || SORT_ORDER.ASC
    });
  }, [initialFilters]);

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      salesAgent: '',
      status: '',
      priority: '',
      sortBy: 'timeToClose',
      sortOrder: SORT_ORDER.ASC
    };
    setFilters(clearedFilters);
    
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  const hasActiveFilters = () => {
    return filters.salesAgent || filters.status || filters.priority;
  };

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        {/* Sales Agent Filter */}
        {showAgentFilter && (
          <div className="filter-group">
            <label htmlFor="filter-agent" className="filter-label">
              Sales Agent
            </label>
            <select
              id="filter-agent"
              className="filter-select"
              value={filters.salesAgent}
              onChange={(e) => handleFilterChange('salesAgent', e.target.value)}
            >
              <option value="">All Agents</option>
              {agents.map((agent) => (
                <option key={agent._id || agent.id} value={agent._id || agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        {showStatusFilter && (
          <div className="filter-group">
            <label htmlFor="filter-status" className="filter-label">
              Status
            </label>
            <select
              id="filter-status"
              className="filter-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Priority Filter */}
        <div className="filter-group">
          <label htmlFor="filter-priority" className="filter-label">
            Priority
          </label>
          <select
            id="filter-priority"
            className="filter-select"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            {LEAD_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By - Fixed to Time to Close */}
        <div className="filter-group">
          <label htmlFor="filter-sort" className="filter-label">
            Sort By
          </label>
          <select
            id="filter-sort"
            className="filter-select"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="timeToClose">Time to Close</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="filter-group">
          <label htmlFor="filter-order" className="filter-label">
            Order
          </label>
          <select
            id="filter-order"
            className="filter-select"
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          >
            <option value={SORT_ORDER.ASC}>Ascending</option>
            <option value={SORT_ORDER.DESC}>Descending</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters() && (
        <button 
          className="clear-filters-btn"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default SimpleFilterBar;
