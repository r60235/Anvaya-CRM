import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SuccessMessage from './SuccessMessage';
import ErrorMessage from './ErrorMessage';
import { NOTIFICATION_TYPES } from '../utils/constants';

const Layout = ({ children }) => {
  const location = useLocation();
  const { notifications, clearNotification, currentUser, setCurrentUser, agents } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Anvaya CRM</h2>
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? '←' : '→'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            {isSidebarOpen && <span>Dashboard</span>}
          </Link>
          
          <Link 
            to="/leads" 
            className={`nav-link ${isActive('/leads') ? 'active' : ''}`}
          >
            <span className="nav-icon">📋</span>
            {isSidebarOpen && <span>Leads</span>}
          </Link>
          
          <Link 
            to="/leads-by-status" 
            className={`nav-link ${isActive('/leads-by-status') ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            {isSidebarOpen && <span>Status View</span>}
          </Link>
          
          <Link 
            to="/leads-by-agent" 
            className={`nav-link ${isActive('/leads-by-agent') ? 'active' : ''}`}
          >
            <span className="nav-icon">👥</span>
            {isSidebarOpen && <span>Agent View</span>}
          </Link>
          
          <Link 
            to="/agents" 
            className={`nav-link ${isActive('/agents') ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            {isSidebarOpen && <span>Sales Agents</span>}
          </Link>
          
          <Link 
            to="/reports" 
            className={`nav-link ${isActive('/reports') ? 'active' : ''}`}
          >
            <span className="nav-icon">📈</span>
            {isSidebarOpen && <span>Reports</span>}
          </Link>
        </nav>

        {isSidebarOpen && agents.length > 0 && (
          <div className="sidebar-footer">
            <label className="footer-label">Current User:</label>
            <select 
              value={currentUser?._id || currentUser?.id || ''} 
              onChange={(e) => {
                const agent = agents.find(a => (a._id || a.id) === e.target.value);
                setCurrentUser(agent);
              }}
              className="agent-select"
            >
              {agents.map(agent => (
                <option key={agent._id || agent.id} value={agent._id || agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Notifications */}
        <div className="notifications-container">
          {notifications.map(notification => {
            if (notification.type === NOTIFICATION_TYPES.SUCCESS) {
              return (
                <SuccessMessage
                  key={notification.id}
                  message={notification.message}
                  onClose={() => clearNotification(notification.id)}
                  duration={0}
                />
              );
            } else if (notification.type === NOTIFICATION_TYPES.ERROR) {
              return (
                <ErrorMessage
                  key={notification.id}
                  message={notification.message}
                  onClose={() => clearNotification(notification.id)}
                  type="banner"
                />
              );
            }
            return null;
          })}
        </div>

        {children}
      </main>
    </div>
  );
};

export default Layout;
