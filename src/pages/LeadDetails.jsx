// src/pages/LeadDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadsAPI, commentsAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import { NOTIFICATION_TYPES, STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants';
import { formatDate, formatTimeToClose } from '../utils/formatters';
import LeadForm from '../components/LeadForm';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const LeadDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { addNotification } = useApp();
  
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadLeadData = async () => {
    if (!id) {
      setError('No lead ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [leadData, commentsData] = await Promise.all([
        leadsAPI.getById(id),
        commentsAPI.getByLead(id).catch(() => []) // Comments might not exist yet
      ]);
      console.log('Lead data received:', leadData);
      console.log('Lead tags:', leadData.tags);
      setLead(leadData);
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (err) {
      console.error('Error loading lead:', err);
      setError(err.normalized?.message || 'Failed to load lead details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeadData();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setIsSubmitting(true);
      const updatedLead = await leadsAPI.update(id, formData);
      setLead(updatedLead);
      setIsEditing(false);
      addNotification('Lead updated successfully', NOTIFICATION_TYPES.SUCCESS);
    } catch (err) {
      const errorMessage = err.normalized?.message || 'Failed to update lead';
      addNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await leadsAPI.delete(id);
      addNotification(`Lead "${lead.name}" deleted successfully!`, NOTIFICATION_TYPES.SUCCESS);
      navigate('/leads');
    } catch (err) {
      const errorMessage = err.normalized?.message || 'Failed to delete lead';
      addNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Loading lead details..." fullScreen />;
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage message={error} onRetry={loadLeadData} type="banner" />
        <button onClick={() => navigate('/leads')} className="btn-secondary">
          Back to Leads
        </button>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="empty-state">
        <p>Lead not found</p>
        <button onClick={() => navigate('/leads')} className="btn-primary">
          Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="lead-details-page">
      <div className="page-header">
        <button onClick={() => navigate('/leads')} className="back-button">
          ← Back to Leads
        </button>
        <div className="header-actions">
          {!isEditing && (
            <>
              <button onClick={() => setIsEditing(true)} className="btn-secondary">
                Edit Lead
              </button>
              <button onClick={handleDelete} className="btn-danger">
                Delete Lead
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="edit-section">
          <h2>Edit Lead</h2>
          <LeadForm
            initialData={lead}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            isLoading={isSubmitting}
          />
        </div>
      ) : ( 
        <div className="lead-details-content">
          <div className="lead-header">
            <h1>{lead.name}</h1>
            <div className="lead-badges">
              <span 
                className="status-badge"
                style={{ backgroundColor: STATUS_COLORS[lead.status] }}
              >
                {lead.status}
              </span>
              <span 
                className="priority-badge"
                style={{ backgroundColor: PRIORITY_COLORS[lead.priority] }}
              >
                {lead.priority} Priority
              </span>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Sales Agent</span>
              <span className="detail-value">{lead.salesAgent?.name || 'Unassigned'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Source</span>
              <span className="detail-value">{lead.source}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time to Close</span>
              <span className="detail-value">{formatTimeToClose(lead.timeToClose)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created</span>
              <span className="detail-value">{formatDate(lead.createdAt, true)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Updated</span>
              <span className="detail-value">{formatDate(lead.updatedAt, true)}</span>
            </div>
            {lead.closedAt && (
              <div className="detail-item">
                <span className="detail-label">Closed</span>
                <span className="detail-value">{formatDate(lead.closedAt, true)}</span>
              </div>
            )}
          </div>

          <div className="tags-section">
            <h3>Tags</h3>
            {lead.tags && lead.tags.length > 0 ? (
              <div className="tags-list">
                {lead.tags.map((tag, index) => (
                  <span key={index} className="tag-chip">{tag}</span>
                ))}
              </div>
            ) : (
              <p className="no-tags">No tags assigned to this lead</p>
            )}
          </div>

          <CommentSection
            leadId={id}
            comments={comments}
            onCommentAdded={loadLeadData}
          />
        </div>
      )}
    </div>
  );
};

export default LeadDetails;
