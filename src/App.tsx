// src/App.tsx
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ChatPanel from "./components/ChatPanel";
import React, { useState } from "react";

function App() {
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Navbar 
        onAddIncident={() => setIncidentDialogOpen(true)}
        onExport={() => setDownloadDialogOpen(true)}
      />
      <Dashboard 
        incidentDialogOpen={incidentDialogOpen}
        setIncidentDialogOpen={setIncidentDialogOpen}
        downloadDialogOpen={downloadDialogOpen}
        setDownloadDialogOpen={setDownloadDialogOpen}
      />
      <ChatPanel />
    </div>
  );
}

export default App;
