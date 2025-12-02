import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { agentsAPI, tagsAPI } from '../services/api';
import { NOTIFICATION_TYPES, NOTIFICATION_DURATION } from '../utils/constants';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [agents, setAgents] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

//Load agents and tags on app, initial

  const loadInitialData = async () => {
    try {
      await Promise.all([
        fetchAgents(),
        fetchTags()
      ]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      addNotification('Failed to load application data', NOTIFICATION_TYPES.ERROR);
    } finally {
      setLoading(false);
    }
  };
 
//Fetch all sales agents from API

  const fetchAgents = async () => {
    try {
      const agentsData = await agentsAPI.getAll();
      setAgents(Array.isArray(agentsData) ? agentsData : []);
      
      // Set first agent as current user if none selected (for comment authorship)
      if (agentsData && agentsData.length > 0 && !currentUser) {
        setCurrentUser(agentsData[0]);
      }
      
      return agentsData;
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      throw error;
    }
  };

//Fetch all tags from API

  const fetchTags = async () => {
    try {
      const tagsData = await tagsAPI.getAll();
      // Handle both array of tag objects and array of strings
      if (Array.isArray(tagsData)) {
        const tagStrings = tagsData.map(tag => 
          typeof tag === 'string' ? tag : tag.name
        );
        setTags(tagStrings);
      } else {
        setTags([]);
      }
      return tagsData;
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      // Don't throw error for tags, just use empty array
      setTags([]);
      return [];
    }
  };

//Add a new sales agent

  const addAgent = async (agentData) => {
    try {
      const newAgent = await agentsAPI.create(agentData);
      setAgents(prev => [...prev, newAgent]);
      addNotification('Sales agent added successfully', NOTIFICATION_TYPES.SUCCESS);
      return newAgent;
    } catch (error) {
      console.error('Failed to add agent:', error);
      const errorMessage = error.normalized?.message || 'Failed to add sales agent';
      addNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
      throw error;
    }
  };

// React Toastify notification
  const addNotification = (message, type = NOTIFICATION_TYPES.INFO) => {
    const toastOptions = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        toast.success(message, toastOptions);
        break;
      case NOTIFICATION_TYPES.ERROR:
        toast.error(message, toastOptions);
        break;
      case NOTIFICATION_TYPES.WARNING:
        toast.warning(message, toastOptions);
        break;
      case NOTIFICATION_TYPES.INFO:
      default:
        toast.info(message, toastOptions);
        break;
    }

    // Still maintain the notifications array for compatibility
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);

    setTimeout(() => {
      clearNotification(id);
    }, 3000);

    return id;
  };

//Clear a specific notification
  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

//Clear all notifications

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    // State
    agents,
    tags,
    currentUser,
    notifications,
    loading,
    
    // Agent methods
    fetchAgents,
    addAgent,
    setCurrentUser,
    
    // Tag methods
    fetchTags,
    
    // Notification methods
    addNotification,
    clearNotification,
    clearAllNotifications
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};