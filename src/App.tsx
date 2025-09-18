// src/App.tsx
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Monitoring from "./pages/Monitoring";
import Settings from "./pages/Settings";
import ChatPanel from "./components/ChatPanel";
import "@progress/kendo-theme-default/dist/all.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

function App() {
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  return (
    <Router>
      <AppContent 
        incidentDialogOpen={incidentDialogOpen}
        setIncidentDialogOpen={setIncidentDialogOpen}
        downloadDialogOpen={downloadDialogOpen}
        setDownloadDialogOpen={setDownloadDialogOpen}
      />
    </Router>
  );
}

function AppContent({ incidentDialogOpen, setIncidentDialogOpen, downloadDialogOpen, setDownloadDialogOpen }: any) {
  const location = useLocation();
  const isMonitoring = location.pathname === "/monitoring";
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar />
      <Navbar 
        onAddIncident={() => setIncidentDialogOpen(true)}
        onExport={() => setDownloadDialogOpen(true)}
        disableAddIncident={isMonitoring}
        disableExport={isMonitoring}
      />
      <Routes>
        <Route path="/" element={
          <Dashboard 
            incidentDialogOpen={incidentDialogOpen}
            setIncidentDialogOpen={setIncidentDialogOpen}
            downloadDialogOpen={downloadDialogOpen}
            setDownloadDialogOpen={setDownloadDialogOpen}
          />
        } />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ChatPanel />
    </div>
  );
}

export default App;
