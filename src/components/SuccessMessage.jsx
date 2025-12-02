import React, { useEffect } from 'react';
import '../styles/SuccessMessage.css';

// Success message component
const SuccessMessage = ({ 
  message, 
  onClose,
  duration = 3000 
}) => {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div className="success-message">
      <div className="success-content">
        <svg 
          className="success-icon" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span className="success-text">{message}</span>
      </div>
      
      {onClose && (
        <button 
          onClick={onClose} 
          className="success-close-btn"
          aria-label="Close success message"
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
  );
};

export default SuccessMessage;
