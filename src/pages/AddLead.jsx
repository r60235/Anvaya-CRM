// src/pages/AddLead.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../hooks/useLeads';
import LeadForm from '../components/LeadForm';

const AddLead = () => {
  const navigate = useNavigate();
  const { createLead } = useLeads();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await createLead(formData);
      // Stay on the form page - success notification is shown by the hook
      // Reset the form by changing the key
      setFormKey(prev => prev + 1);
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/leads');
  };

  return (
    <div className="add-lead-page">
      <div className="page-header">
        <button onClick={handleCancel} className="back-button">
          ← Back to Leads
        </button>
      </div>

      <div className="form-container">
        <h1>Create New Lead</h1>
        <LeadForm
          key={formKey}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AddLead;
