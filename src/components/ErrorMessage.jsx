import React from 'react';
import '../styles/ErrorMessage.css';

// Error message component
const ErrorMessage = ({ 
  message, 
  onRetry, 
  type = 'inline',
  onClose 
}) => {
  if (!message) return null;

  const containerClass = type === 'banner' ? 'error-banner' : 'error-inline';

  return (
    <div className={`error-message ${containerClass}`}>
      <div className="error-content">
        <svg 
          className="error-icon" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span className="error-text">{message}</span>
      </div>
      
      <div className="error-actions">
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="error-retry-btn"
          >
            Retry
          </button>
        )}
        {onClose && (
          <button 
            onClick={onClose} 
            className="error-close-btn"
            aria-label="Close error message"
          >
            <svg 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
