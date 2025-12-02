import React from 'react';
import '../styles/LoadingSpinner.css';

// Loading spinner component
const LoadingSpinner = ({ size = 'medium', message = '', fullScreen = false }) => {
  const sizeClass = `spinner-${size}`;
  
  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className={`spinner ${sizeClass}`}></div>
          {message && <p className="loading-message">{message}</p>}
        </div>
      </div>
    );
  }
   
  return (
    <div className="loading-container">
      <div className={`spinner ${sizeClass}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
