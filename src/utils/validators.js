// src/utils/validators.js
import { LEAD_SOURCES, LEAD_STATUSES, LEAD_PRIORITIES } from './constants';

// Function
export const validateLeadName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Lead name is required';
  }
  if (name.trim().length < 2) {
    return 'Lead name must be at least 2 characters';
  }
  return null;
};

// Function
export const validateLeadSource = (source) => {
  if (!source) {
    return 'Lead source is required';
  }
  if (!LEAD_SOURCES.includes(source)) {
    return 'Invalid lead source';
  }
  return null;
};

// Function
export const validateSalesAgent = (agentId) => {
  if (!agentId) {
    return 'Sales agent is required';
  }
  return null;
};

// Function
export const validateLeadStatus = (status) => {
  if (!status) {
    return 'Lead status is required';
  }
  if (!LEAD_STATUSES.includes(status)) {
    return 'Invalid lead status';
  }
  return null;
};

// Function
export const validateTimeToClose = (timeToClose) => {
  if (!timeToClose && timeToClose !== 0) {
    return 'Time to close is required';
  }
  const numValue = Number(timeToClose);
  if (isNaN(numValue)) {
    return 'Time to close must be a number';
  }
  if (numValue < 1) {
    return 'Time to close must be a positive number';
  }
  return null;
};

// Function
export const validatePriority = (priority) => {
  if (!priority) {
    return 'Priority is required';
  }
  if (!LEAD_PRIORITIES.includes(priority)) {
    return 'Invalid priority';
  }
  return null;
};

// Function
export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

// Function
export const validateAgentName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Agent name is required';
  }
  if (name.trim().length < 2) {
    return 'Agent name must be at least 2 characters';
  }
  return null;
};

// Function
export const validateLeadForm = (formData) => {
  const errors = {};

  const nameError = validateLeadName(formData.name);
  if (nameError) errors.name = nameError;

  const sourceError = validateLeadSource(formData.source);
  if (sourceError) errors.source = sourceError;

  const agentError = validateSalesAgent(formData.salesAgent);
  if (agentError) errors.salesAgent = agentError;

  const statusError = validateLeadStatus(formData.status);
  if (statusError) errors.status = statusError;

  const timeToCloseError = validateTimeToClose(formData.timeToClose);
  if (timeToCloseError) errors.timeToClose = timeToCloseError;

  const priorityError = validatePriority(formData.priority);
  if (priorityError) errors.priority = priorityError;

  return errors;
};

// Function
export const validateAgentForm = (formData) => {
  const errors = {};

  const nameError = validateAgentName(formData.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  return errors;
};

// Function
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};
