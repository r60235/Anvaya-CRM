// src/utils/constants.js

// Lead Sources
export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'Cold Call',
  'Advertisement',
  'Email',
  'Other'
];

// Lead Statuses
export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Closed'
];

// Lead Priorities
export const LEAD_PRIORITIES = [
  'High',
  'Medium',
  'Low'
];

// Status Colors for UI
export const STATUS_COLORS = {
  'New': '#3b82f6',           // Blue
  'Contacted': '#eab308',     // Yellow
  'Qualified': '#a855f7',     // Purple
  'Proposal Sent': '#f97316', // Orange
  'Closed': '#22c55e'         // Green
};

// Priority Colors for UI
export const PRIORITY_COLORS = {
  'High': '#ef4444',    // Red
  'Medium': '#f97316',  // Orange
  'Low': '#6b7280'      // Gray
};

// API Base URL
export const API_BASE_URL = 'https://anvaya-backend-nu.vercel.app/api';

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Notification Duration (milliseconds)
export const NOTIFICATION_DURATION = 3000;

// Sort Options
export const SORT_OPTIONS = [
  { value: 'timeToClose', label: 'Time to Close' },
  { value: 'priority', label: 'Priority' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'name', label: 'Lead Name' }
];

// Sort Order
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc'
};

// Priority Order for Sorting
export const PRIORITY_ORDER = {
  'High': 1,
  'Medium': 2,
  'Low': 3
};

// Status Order for Display
export const STATUS_ORDER = {
  'New': 1,
  'Contacted': 2,
  'Qualified': 3,
  'Proposal Sent': 4,
  'Closed': 5
};
