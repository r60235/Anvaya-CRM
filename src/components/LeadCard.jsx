import React from 'react';
import { useNavigate } from 'react-router-dom';
import { STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants';
import { formatTimeToClose } from '../utils/formatters';
import '../styles/LeadCard.css';

// Lead card component for displaying lead summary
const LeadCard = ({ lead, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(lead);
    } else {
      // Try multiple ID formats
      const leadId = lead._id || lead.id;
      if (leadId) {
        navigate(`/leads/${leadId}`);
      } else {
        console.error('Lead has no ID:', lead);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const statusColor = STATUS_COLORS[lead.status] || '#6b7280';
  const priorityColor = PRIORITY_COLORS[lead.priority] || '#6b7280';

  return (
    <div 
      className="lead-card"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${lead.name}`}
    >
      <div className="lead-card-header">
        <h3 className="lead-name">{lead.name}</h3>
        <span 
          className="priority-indicator"
          style={{ backgroundColor: priorityColor }}
          title={`Priority: ${lead.priority}`}
        >
          {lead.priority}
        </span>
      </div>

      <div className="lead-card-body">
        <div className="lead-info-row">
          <span className="lead-label">Agent:</span>
          <span className="lead-value">
            {lead.salesAgent?.name || 'Unassigned'}
          </span>
        </div>

        <div className="lead-info-row">
          <span className="lead-label">Source:</span>
          <span className="lead-value">{lead.source}</span>
        </div>

        <div className="lead-info-row">
          <span className="lead-label">Time to Close:</span>
          <span className="lead-value">
            {formatTimeToClose(lead.timeToClose)}
          </span>
        </div>
      </div>

      <div className="lead-card-footer">
        <span 
          className="status-badge"
          style={{ 
            backgroundColor: statusColor,
            color: 'white'
          }}
        >
          {lead.status}
        </span>

        {lead.tags && lead.tags.length > 0 && (
          <div className="tags-container">
            {lead.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag-badge">
                {tag}
              </span>
            ))}
            {lead.tags.length > 3 && (
              <span className="tag-badge tag-more">
                +{lead.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCard;
