# Anvaya CRM

A full-stack CRM application for managing sales leads, tracking progress through the sales pipeline, and generating insightful reports. Built with a React frontend, Express/Node backend, MongoDB database, and featuring real-time updates.

---

## Demo Link

[Live Demo](https://anvaya-frontend-kappa.vercel.app)

---

## Quick Start

```bash
git clone https://github.com/r60235/anvaya-frontend.git
cd anvaya-frontend
npm install
npm run dev
```

## Technologies

- React 19.2.0
- React Router DOM 7.9.6
- Vite 7.2.4
- Chart.js 4.5.1
- Axios 1.13.2
- Node.js
- Express.js
- MongoDB

## Demo Video

Watch a walkthrough of all major features of this app:

[Explaination Video Link](https://drive.google.com/file/d/1a4oWpPyGhCf5WTYMGV6uyKK4qmhumV9Z/view?usp=drive_link)

## Features

**Dashboard**
- Overview of total leads, pipeline status, and closed deals
- Quick access to recent leads and common actions
- Status distribution visualization

**Lead Management**
- Create, view, edit, and delete leads
- Assign leads to sales agents
- Track lead status (New → Contacted → Qualified → Proposal Sent → Closed)
- Set priority levels (High, Medium, Low)
- Estimate time to close
- Add custom tags for categorization

**Lead Views**
- List view with filtering and sorting
- Status view (Kanban-style columns)
- Agent view (grouped by sales agent)
- Filter by sales agent, status, and priority
- Sort by time to close, priority, or creation date

**Comments & Collaboration**
- Add comments to leads for progress tracking
- View comment history with timestamps and authors

**Reports & Analytics**
- Total leads: Closed vs In Pipeline (Pie Chart)
- Leads closed by sales agent (Bar Chart)
- Lead status distribution (Bar Chart)
- Responsive charts powered by Chart.js

**Sales Agent Management**
- Add and manage sales agents
- View agent workload and performance
- Assign/reassign leads to agents

## API Reference

### **GET /api/leads**
<br>
List all leads with optional filtering
<br>
Sample Response:
<br>

```json
[
  {
    "_id": "123",
    "name": "Acme Corp",
    "status": "Qualified",
    "priority": "High",
    "salesAgent": "agent_id",
    "timeToClose": 30
  }
]
```

### **GET /api/leads/:id**
<br>
Get details for one lead
<br>
Sample Response:
<br>

```json
{
  "_id": "123",
  "name": "Acme Corp",
  "source": "Website",
  "status": "Qualified",
  "priority": "High",
  "salesAgent": { "_id": "agent_id", "name": "John Doe" },
  "timeToClose": 30,
  "tags": ["enterprise", "tech"],
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### **POST /api/leads**
<br>
Create a new lead
<br>
Sample Response:
<br>

```json
{
  "_id": "124",
  "name": "New Lead",
  "status": "New",
  "priority": "Medium"
}
```

### **PUT /api/leads/:id**
<br>
Update an existing lead
<br>
Sample Response:
<br>

```json
{
  "_id": "123",
  "name": "Updated Lead",
  "status": "Contacted"
}
```

### **DELETE /api/leads/:id**
<br>
Delete a lead
<br>
Sample Response:
<br>

```json
{
  "message": "Lead deleted successfully"
}
```

### **GET /api/agents**
<br>
List all sales agents
<br>
Sample Response:
<br>

```json
[
  {
    "_id": "agent_1",
    "name": "John Doe",
    "email": "john@company.com"
  }
]
```

### **POST /api/agents**
<br>
Create a new sales agent
<br>
Sample Response:
<br>

```json
{
  "_id": "agent_2",
  "name": "Jane Smith",
  "email": "jane@company.com"
}
```

### **GET /api/leads/:id/comments**
<br>
Get comments for a lead
<br>
Sample Response:
<br>

```json
[
  {
    "_id": "comment_1",
    "commentText": "Follow up scheduled",
    "author": "John Doe",
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

### **POST /api/leads/:id/comments**
<br>
Add a comment to a lead
<br>
Sample Response:
<br>

```json
{
  "_id": "comment_2",
  "commentText": "Meeting completed",
  "author": "John Doe",
  "createdAt": "2024-01-16T14:30:00Z"
}
```

### **GET /api/report/closed-by-agent**
<br>
Get closed leads count by agent
<br>
Sample Response:
<br>

```json
[
  {
    "agentName": "John Doe",
    "closedCount": 15
  }
]
```

## Contact

For bugs or feature requests, please reach out to rishaabh105@gmail.com
