import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buildQueryString } from '../utils/formatters';

// Custom hook for URL-based filtering
export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filters directly from URL params
  const [filters, setFiltersState] = useState(() => {
    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      urlFilters[key] = value;
    }
    console.log('useFilters: Initial filters from URL:', urlFilters);
    return urlFilters;
  });

  // Update filters when URL changes
  useEffect(() => {
    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      urlFilters[key] = value;
    }
    console.log('useFilters: URL params changed, new filters:', urlFilters);
    setFiltersState(urlFilters);
  }, [searchParams]);

  // Set a single filter
  const setFilter = (key, value) => {
    setFiltersState(prev => {
      const newFilters = { ...prev };
      
      if (value === null || value === undefined || value === '') {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      
      // Update URL
      setSearchParams(newFilters);
      
      return newFilters;
    });
  };

  // Set multiple filters at once
  const setFilters = (newFilters) => {
    const cleanedFilters = {};
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        cleanedFilters[key] = value;
      }
    });
    
    setFiltersState(cleanedFilters);
    setSearchParams(cleanedFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setFiltersState({});
    setSearchParams({});
  };

  // Clear a specific filter
  const clearFilter = (key) => {
    setFiltersState(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      setSearchParams(newFilters);
      return newFilters;
    });
  };

  // Get URL with current filters
  const getFilteredUrl = (basePath = '') => {
    const queryString = buildQueryString(filters);
    return `${basePath}${queryString}`;
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return Object.keys(filters).length > 0;
  };

  // Get filter value by key
  const getFilter = (key) => {
    return filters[key];
  };

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
    clearFilter,
    getFilteredUrl,
    hasActiveFilters,
    getFilter
  };
};

export default useFilters;
