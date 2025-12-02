# Anvaya CRM - Sales Lead Management System

A comprehensive MERN stack CRM application for managing sales leads, tracking progress, and generating reports.

## Features

### Lead Management
- ✅ Create, read, update, and delete leads
- ✅ Assign leads to sales agents
- ✅ Track lead status through sales pipeline (New → Contacted → Qualified → Proposal Sent → Closed)
- ✅ Set priority levels (High, Medium, Low)
- ✅ Estimate time to close
- ✅ Categorize with custom tags
- ✅ Track lead sources (Website, Referral, Cold Call, etc.)

### Comments & Collaboration
- ✅ Add comments to leads for progress tracking
- ✅ View comment history with timestamps and authors
- ✅ Real-time comment updates

### Filtering & Organization
- ✅ URL-based filtering for easy sharing
- ✅ Filter by sales agent, status, source, and tags
- ✅ Sort by priority, time to close, or creation date
- ✅ View leads grouped by status (Kanban-style)
- ✅ View leads grouped by sales agent

### Reports & Analytics
- ✅ Dashboard with key metrics
- ✅ Leads closed last week visualization
- ✅ Pipeline overview
- ✅ Closed leads by agent (bar chart)
- ✅ Lead status distribution (pie chart)
- ✅ Interactive Chart.js visualizations

### Sales Agent Management
- ✅ Add and manage sales agents
- ✅ Assign leads to agents
- ✅ Track agent workload and performance

## Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **React Router DOM 7.9.6** - Client-side routing
- **Axios 1.13.2** - HTTP client
- **Chart.js 4.5.1** - Data visualization
- **react-chartjs-2 5.3.1** - React wrapper for Chart.js
- **Vite 7.2.4** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

## Project Structure

```
anvaya-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CommentSection.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── FilterBar.jsx
│   │   ├── Layout.jsx
│   │   ├── LeadCard.jsx
│   │   ├── LeadForm.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── SuccessMessage.jsx
│   ├── context/             # React Context
│   │   └── AppContext.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAgents.jsx
│   │   ├── useFilters.jsx
│   │   └── useLeads.jsx
│   ├── pages/               # Page components
│   │   ├── AddLead.jsx
│   │   ├── AddSalesAgent.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LeadDetails.jsx
│   │   ├── LeadList.jsx
│   │   ├── LeadStatusView.jsx
│   │   ├── Reports.jsx
│   │   ├── SalesAgentManagement.jsx
│   │   └── SalesAgentView.jsx
│   ├── services/            # API services
│   │   └── api.js
│   ├── styles/              # CSS files
│   │   └── App.css
│   ├── utils/               # Utility functions
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── public/
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance running
- Backend API running at `https://anvaya-backend-nu.vercel.app/api`

### Installation



### API Endpoints Used:
- `GET /leads` - Fetch all leads (with optional filters)
- `GET /leads/:id` - Fetch single lead
- `POST /leads` - Create new lead
- `PUT /leads/:id` - Update lead
- `DELETE /leads/:id` - Delete lead
- `GET /agents` - Fetch all sales agents
- `POST /agents` - Create new agent
- `GET /leads/:id/comments` - Fetch lead comments
- `POST /leads/:id/comments` - Add comment to lead
- `GET /tags` - Fetch all tags
- `POST /tags` - Create new tag
- `GET /report/last-week` - Leads closed last week
- `GET /report/pipeline` - Pipeline statistics
- `GET /report/closed-by-agent` - Closed leads by agent

## Features in Detail

### URL-Based Filtering
Share filtered views with team members using URL parameters:
- `/leads?status=New` - View all new leads
- `/leads?salesAgent=<agentId>` - View leads by agent
- `/leads?status=Qualified&priority=High` - Combine multiple filters

### Lead Status Pipeline
1. **New** 
2. **Contacted** 
3. **Qualified** 
4. **Proposal Sent** 
5. **Closed** 

### Priority Levels
- **High** 
- **Medium** 
- **Low**

### Lead Sources
Track where leads originate:
- Website
- Referral
- Cold Call
- Advertisement
- Email
- Other

## Acknowledgments
- Built with React and Vite
- Charts powered by Chart.js
- Icons from emoji set
