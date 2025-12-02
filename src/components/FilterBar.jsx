import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LEAD_STATUSES, SORT_OPTIONS, SORT_ORDER } from '../utils/constants';
import '../styles/FilterBar.css';

// Filter bar component for filtering and sorting leads
const FilterBar = ({ onFilterChange, initialFilters = {} }) => {
  const { agents } = useApp();
  const [filters, setFilters] = useState({
    salesAgent: initialFilters.salesAgent || '',
    status: initialFilters.status || '',
    sortBy: initialFilters.sortBy || '',
    sortOrder: initialFilters.sortOrder || SORT_ORDER.ASC
  });

  useEffect(() => {
    setFilters({
      salesAgent: initialFilters.salesAgent || '',
      status: initialFilters.status || '',
      sortBy: initialFilters.sortBy || '',
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
      sortBy: '',
      sortOrder: SORT_ORDER.ASC
    };
    setFilters(clearedFilters);
    
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  const hasActiveFilters = () => {
    return filters.salesAgent || filters.status || filters.sortBy;
  };

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        {/* Sales Agent Filter */}
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

        {/* Status Filter */}
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

        {/* Sort By */}
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
            <option value="">Default</option>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        {filters.sortBy && (
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
        )}
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

export default FilterBar;
