// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LeadList from './pages/LeadList';
import LeadDetails from './pages/LeadDetails';
import AddLead from './pages/AddLead';
import SalesAgentManagement from './pages/SalesAgentManagement';
import AddSalesAgent from './pages/AddSalesAgent';
import Reports from './pages/Reports';
import LeadStatusView from './pages/LeadStatusView';
import SalesAgentView from './pages/SalesAgentView';
import './styles/App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<LeadList />} />
            <Route path="/leads/new" element={<AddLead />} />
            <Route path="/leads/:id" element={<LeadDetails />} />
            <Route path="/agents" element={<SalesAgentManagement />} />
            <Route path="/agents/new" element={<AddSalesAgent />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/leads-by-status" element={<LeadStatusView />} />
            <Route path="/leads-by-agent" element={<SalesAgentView />} />
          </Routes>
        </Layout>
        <ToastContainer />
      </Router>
    </AppProvider>
  );
}

export default App;