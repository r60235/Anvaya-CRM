// src/utils/formatters.js

// Function
export const formatDate = (date, includeTime = false) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString('en-US', options);
};

// Function
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
  
  return formatDate(dateObj);
};

// Function
export const formatTimeToClose = (days) => {
  if (!days && days !== 0) return '';
  
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;
  
  if (remainingDays === 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  }
  
  return `${weeks} week${weeks > 1 ? 's' : ''}, ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
};

// Function
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Function
export const formatTags = (tags) => {
  if (!tags || !Array.isArray(tags) || tags.length === 0) return '';
  return tags.join(', ');
};

// Function
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Function
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString('en-US');
};

// Function
export const getInitials = (name) => {
  if (!name) return '';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Function
export const formatErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // If error has a response from the server
  if (error.response) {
    const { status, data } = error.response;
    
    // Handle specific status codes
    if (status === 404) {
      return data?.error || 'Resource not found';
    }
    if (status === 400) {
      return data?.error || 'Invalid request data';
    }
    if (status === 409) {
      return data?.error || 'Resource already exists';
    }
    if (status === 500) {
      return 'Server error. Please try again later';
    }
    
    // Return error message from response
    return data?.error || data?.message || 'An error occurred';
  }
  
  // Network error
  if (error.request) {
    return 'Network error. Please check your connection';
  }
  
  // Other errors
  return error.message || 'An error occurred';
};

// Function
export const parseQueryString = (queryString) => {
  if (!queryString) return {};
  
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

// Function
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};
