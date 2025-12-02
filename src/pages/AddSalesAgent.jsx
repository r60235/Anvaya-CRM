// src/pages/AddSalesAgent.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgents } from '../hooks/useAgents';
import { validateAgentForm, hasErrors } from '../utils/validators';

const AddSalesAgent = () => {
  const navigate = useNavigate();
  const { createAgent } = useAgents();
  
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on change
    const validationErrors = validateAgentForm({ ...formData, [field]: value });
    setErrors(validationErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({ name: true, email: true });
    const validationErrors = validateAgentForm(formData);
    
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await createAgent(formData);
      navigate('/agents');
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldShowError = (field) => touched[field] && errors[field];

  return (
    <div className="add-agent-page">
      <div className="page-header">
        <button onClick={() => navigate('/agents')} className="back-button">
          ← Back to Agents
        </button>
      </div>

      <div className="form-container">
        <h1>Add New Sales Agent</h1>
        <form onSubmit={handleSubmit} className="agent-form">
          <div className="form-group">
            <label htmlFor="agent-name" className="form-label required">
              Agent Name
            </label>
            <input
              id="agent-name"
              type="text"
              className={`form-input ${shouldShowError('name') ? 'input-error' : ''}`}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter agent name"
              disabled={isSubmitting}
            />
            {shouldShowError('name') && (
              <span className="error-text">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="agent-email" className="form-label required">
              Email Address
            </label>
            <input
              id="agent-email"
              type="email"
              className={`form-input ${shouldShowError('email') ? 'input-error' : ''}`}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address"
              disabled={isSubmitting}
            />
            {shouldShowError('email') && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || hasErrors(errors)}
            >
              {isSubmitting ? 'Creating...' : 'Create Agent'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/agents')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalesAgent;
