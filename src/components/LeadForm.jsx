import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LEAD_SOURCES, LEAD_STATUSES, LEAD_PRIORITIES } from '../utils/constants';
import { validateLeadForm, hasErrors } from '../utils/validators';
import LoadingSpinner from './LoadingSpinner';
import '../styles/LeadForm.css';

// Lead form component for creating and editing leads
const LeadForm = ({ initialData, onSubmit, onCancel, isLoading = false }) => {
  const { agents, tags } = useApp();
   
  const [formData, setFormData] = useState({
    name: '',
    source: 'Website',
    salesAgent: '',
    status: 'New',
    tags: [],
    timeToClose: 30,
    priority: 'Medium'
  });
  
  const [errors, setErrors] = useState({});
  const [customTag, setCustomTag] = useState('');
  const [touched, setTouched] = useState({});

  // Initialize form with initial data (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        source: initialData.source || 'Website',
        salesAgent: initialData.salesAgent?._id || initialData.salesAgent?.id || initialData.salesAgent || '',
        status: initialData.status || 'New',
        tags: initialData.tags || [],
        timeToClose: initialData.timeToClose || 30,
        priority: initialData.priority || 'Medium'
      });
    }
  }, [initialData]);

  // Validate form whenever formData changes
  useEffect(() => {
    const validationErrors = validateLeadForm(formData);
    setErrors(validationErrors);
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Validate form
    const validationErrors = validateLeadForm(formData);
    
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    
    // Prepare data for submission
    const submitData = {
      ...formData,
      timeToClose: Number(formData.timeToClose)
    };
    
    // Add closedAt if status is Closed
    if (formData.status === 'Closed' && !initialData?.closedAt) {
      submitData.closedAt = new Date().toISOString();
    }
    
    if (onSubmit) {
      onSubmit(submitData);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = customTag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleToggleTag = (tag) => {
    if (formData.tags.includes(tag)) {
      handleRemoveTag(tag);
    } else {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const shouldShowError = (field) => {
    return touched[field] && errors[field];
  };

  return (
    <form onSubmit={handleSubmit} className="lead-form" noValidate>
      {/* Lead Name */}
      <div className="form-group">
        <label htmlFor="lead-name" className="form-label required">
          Lead Name
        </label>
        <input
          id="lead-name"
          type="text"
          className={`form-input ${shouldShowError('name') ? 'input-error' : ''}`}
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          placeholder="Enter lead name"
          disabled={isLoading}
        />
        {shouldShowError('name') && (
          <span className="error-text">{errors.name}</span>
        )}
      </div>

      {/* Lead Source */}
      <div className="form-group">
        <label htmlFor="lead-source" className="form-label required">
          Lead Source
        </label>
        <select
          id="lead-source"
          className={`form-select ${shouldShowError('source') ? 'input-error' : ''}`}
          value={formData.source}
          onChange={(e) => handleChange('source', e.target.value)}
          onBlur={() => handleBlur('source')}
          disabled={isLoading}
        >
          {LEAD_SOURCES.map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>
        {shouldShowError('source') && (
          <span className="error-text">{errors.source}</span>
        )} 
      </div>

      {/* Assigned Sales Agent */}
      <div className="form-group">
        <label htmlFor="sales-agent" className="form-label required">
          Assigned Sales Agent
        </label>
        <select
          id="sales-agent"
          className={`form-select ${shouldShowError('salesAgent') ? 'input-error' : ''}`}
          value={formData.salesAgent}
          onChange={(e) => handleChange('salesAgent', e.target.value)}
          onBlur={() => handleBlur('salesAgent')}
          disabled={isLoading}
        >
          <option value="">Select an agent</option>
          {agents.map(agent => (
            <option key={agent._id || agent.id} value={agent._id || agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
        {shouldShowError('salesAgent') && (
          <span className="error-text">{errors.salesAgent}</span>
        )}
      </div>

      {/* Lead Status */}
      <div className="form-group">
        <label htmlFor="lead-status" className="form-label required">
          Lead Status
        </label>
        <select
          id="lead-status"
          className={`form-select ${shouldShowError('status') ? 'input-error' : ''}`}
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          onBlur={() => handleBlur('status')}
          disabled={isLoading}
        >
          {LEAD_STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        {shouldShowError('status') && (
          <span className="error-text">{errors.status}</span>
        )}
      </div>

      {/* Priority */}
      <div className="form-group">
        <label htmlFor="priority" className="form-label required">
          Priority
        </label>
        <select
          id="priority"
          className={`form-select ${shouldShowError('priority') ? 'input-error' : ''}`}
          value={formData.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          onBlur={() => handleBlur('priority')}
          disabled={isLoading}
        >
          {LEAD_PRIORITIES.map(priority => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>
        {shouldShowError('priority') && (
          <span className="error-text">{errors.priority}</span>
        )}
      </div>

      {/* Time to Close */}
      <div className="form-group">
        <label htmlFor="time-to-close" className="form-label required">
          Time to Close (days)
        </label>
        <input
          id="time-to-close"
          type="number"
          min="1"
          className={`form-input ${shouldShowError('timeToClose') ? 'input-error' : ''}`}
          value={formData.timeToClose}
          onChange={(e) => handleChange('timeToClose', e.target.value)}
          onBlur={() => handleBlur('timeToClose')}
          placeholder="Enter estimated days"
          disabled={isLoading}
        />
        {shouldShowError('timeToClose') && (
          <span className="error-text">{errors.timeToClose}</span>
        )}
      </div>

      {/* Tags */}
      <div className="form-group">
        <label className="form-label">Tags</label>
        
        {/* Selected Tags */}
        {formData.tags.length > 0 && (
          <div className="selected-tags">
            {formData.tags.map(tag => (
              <span key={tag} className="tag-chip">
                {tag}
                <button
                  type="button"
                  className="tag-remove"
                  onClick={() => handleRemoveTag(tag)}
                  disabled={isLoading}
                  aria-label={`Remove ${tag} tag`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Available Tags */}
        {tags.length > 0 && (
          <div className="available-tags">
            <p className="tags-label">Available tags:</p>
            <div className="tags-grid">
              {tags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-button ${formData.tags.includes(tag) ? 'tag-selected' : ''}`}
                  onClick={() => handleToggleTag(tag)}
                  disabled={isLoading}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Custom Tag Input */}
        <div className="custom-tag-input">
          <input
            type="text"
            className="form-input"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Add custom tag"
            disabled={isLoading}
          />
          <button
            type="button"
            className="add-tag-btn"
            onClick={handleAddTag}
            disabled={isLoading || !customTag.trim()}
          >
            Add Tag
          </button>
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading || hasErrors(errors)}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" />
              <span>{initialData ? 'Updating...' : 'Creating...'}</span>
            </>
          ) : (
            <span>{initialData ? 'Update Lead' : 'Create Lead'}</span>
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default LeadForm;