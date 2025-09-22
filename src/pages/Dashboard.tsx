// src/pages/Dashboard.tsx
import React, { useRef, useState } from "react";
import Hero from "../components/Hero";
import StatsCard from "../components/StatsCard";
import IncidentGrid from "../components/IncidentGrid";
import { useI18n } from "../i18n";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Notification, NotificationGroup } from "@progress/kendo-react-notification";
import { Chart, ChartSeries, ChartSeriesItem, ChartLegend, ChartCategoryAxis, ChartCategoryAxisItem } from "@progress/kendo-react-charts";
import { incidents as staticIncidents, Incident } from "../data/incidents";
import { Button } from "@progress/kendo-react-buttons";

interface DashboardProps {
  incidentDialogOpen?: boolean;
  setIncidentDialogOpen?: (open: boolean) => void;
  downloadDialogOpen?: boolean;
  setDownloadDialogOpen?: (open: boolean) => void;
}

import IncidentForm from "../components/IncidentForm";

const Dashboard: React.FC<DashboardProps> = ({
  incidentDialogOpen,
  setIncidentDialogOpen = () => {},
  downloadDialogOpen,
  setDownloadDialogOpen = () => {}
}) => {

  // Incident state management
  const [incidents, setIncidents] = React.useState<Incident[]>(() => {
    const stored = localStorage.getItem("incidents");
    if (stored) return JSON.parse(stored);
    // fallback to static if localStorage empty
    return staticIncidents;
  });

  // Save incidents to localStorage whenever changed
  React.useEffect(() => {
    localStorage.setItem("incidents", JSON.stringify(incidents));
  }, [incidents]);

  // Quick stats
  const total = incidents.length;
  const critical = incidents.filter((i: Incident) => i.severity === "Critical").length;
  const high = incidents.filter((i: Incident) => i.severity === "High").length;

  // Analytics: By Type
  const types = ["Injury", "Equipment", "Near-Miss", "Environmental"];
  const typeCounts = types.map((t) => incidents.filter((i: Incident) => i.type === t).length);

  // Analytics: By Severity
  const severities = ["Low", "Medium", "High", "Critical"];
  const severityCounts = severities.map((s) => incidents.filter((i: Incident) => i.severity === s).length);

  // Analytics: By Month (trend)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthCounts = Array(12).fill(0);
  incidents.forEach((i: Incident) => {
    const d = new Date(i.date);
    monthCounts[d.getMonth()]++;
  });

  // Top Locations
  const locationMap: Record<string, number> = {};
  incidents.forEach((i: Incident) => {
    locationMap[i.location] = (locationMap[i.location] || 0) + 1;
  });
  const topLocations = (Object.entries(locationMap) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Notification state
  const [notification, setNotification] = useState<{type: string, text: string} | null>(null);
  // Refs to trigger export in IncidentGrid
  const pdfExportRef = useRef<any>(null);
  const excelExportRef = useRef<any>(null);

  const handleDownload = (type: 'pdf' | 'excel') => {
    setDownloadDialogOpen(false);
    setTimeout(() => {
      if (type === 'pdf' && pdfExportRef.current) pdfExportRef.current();
      if (type === 'excel' && excelExportRef.current) excelExportRef.current();
      setNotification({ type: 'success', text: `Incidents exported as ${type.toUpperCase()}` });
    }, 200);
  };

  // Notification close
  const handleNotificationClose = () => setNotification(null);

  // Pass export triggers to IncidentGrid
  const incidentGridProps = {
    pdfExportTrigger: (cb: any) => (pdfExportRef.current = cb),
    excelExportTrigger: (cb: any) => (excelExportRef.current = cb),
  };

  // Handler to add new incident
  const handleAddIncident = (incident: any) => {
    // Assign new id
    const maxId = incidents.length > 0 ? Math.max(...incidents.map((i: any) => i.id)) : 0;
    setIncidents([
      ...incidents,
      { ...incident, id: maxId + 1, date: incident.date instanceof Date ? incident.date.toISOString() : incident.date }
    ]);
    setNotification({ type: 'success', text: 'Incident created!' });
  };

  const { t } = useI18n();
  return (
    <main className="md:ml-64 mt-14 p-6 bg-white dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Hero />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatsCard title={t("totalIncidents") } value={total} />
        <StatsCard title={t("criticalIncidents") } value={critical} />
        <StatsCard title={t("highSeverity") } value={high} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <IncidentGrid {...incidentGridProps} incidents={incidents} />
          <h2 className="text-xl font-bold text-gray-700 mt-10 mb-4 text-left">{t("incidentAdding")}</h2>
          <IncidentForm onSubmit={handleAddIncident} />
        </div>

        <div className="space-y-4">
          {/* By Type Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 mb-2">{t("incidentsByType")}</div>
            <Chart style={{ height: 180 }}>
              <ChartCategoryAxis>
                <ChartCategoryAxisItem categories={types} />
              </ChartCategoryAxis>
              <ChartSeries>
                <ChartSeriesItem type="column" data={typeCounts} />
              </ChartSeries>
            </Chart>
          </div>

          {/* By Severity Pie Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 mb-2">{t("severityDistribution")}</div>
            <Chart style={{ height: 180 }}>
              <ChartSeries>
                <ChartSeriesItem
                  type="pie"
                  data={severities.map((s, idx) => ({ category: s, value: severityCounts[idx] }))}
                  field="value"
                  categoryField="category"
                />
              </ChartSeries>
              <ChartLegend position="bottom" visible={true} />
            </Chart>
          </div>
      
          {/* Trend by Month */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 mb-2">{t("incidentsByMonth")}</div>
            <Chart style={{ height: 180 }}>
              <ChartCategoryAxis>
                <ChartCategoryAxisItem categories={months} />
              </ChartCategoryAxis>
              <ChartSeries>
                <ChartSeriesItem type="line" data={monthCounts} />
              </ChartSeries>
            </Chart>
          </div>

          {/* Top Locations */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 mb-2">{t("topLocations")}</div>
            <ul className="text-xs text-gray-700 space-y-1">
              {topLocations.map(([loc, count]) => (
                <li key={loc} className="flex justify-between"><span>{String(loc)}</span><span className="font-bold">{String(count)}</span></li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">{t("quickActions")}</div>
            <div className="mt-3 flex flex-col gap-2">
              <Button themeColor="warning" className="w-full" onClick={() => setNotification({type:'info',text:'Investigation started'})}>{t("startInvestigation")}</Button>
              <Button themeColor="error" className="w-full" onClick={() => setNotification({type:'error',text:'Emergency protocols triggered!'})}>{t("emergencyProtocols")}</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Download Dialog (for Navbar/quick actions) */}
      {downloadDialogOpen && setDownloadDialogOpen && (
        <Dialog title={t("downloadAllData") } onClose={() => setDownloadDialogOpen(false)}>
          <div className="mb-4">{t("chooseFormat")}</div>
          <DialogActionsBar>
            <Button themeColor="primary" onClick={() => handleDownload('pdf')}>{t("pdf")}</Button>
            <Button themeColor="success" onClick={() => handleDownload('excel')}>{t("excel")}</Button>
            <Button onClick={() => setDownloadDialogOpen(false)}>{t("cancel")}</Button>
          </DialogActionsBar>
        </Dialog>
      )}
      {/* Incident Creation Modal (for Navbar) */}
      {incidentDialogOpen && setIncidentDialogOpen && (
        <Dialog title={t("addNewIncident") } onClose={() => setIncidentDialogOpen(false)}>
          <IncidentForm onSubmit={() => {
            setIncidentDialogOpen(false);
            setNotification({ type: 'success', text: t("incidentCreated") });
          }} />
        </Dialog>
      )}

      {/* Notification */}
      <NotificationGroup style={{ right: 24, bottom: 24, position: 'fixed', zIndex: 1000 }}>
        {notification && (
          <Notification type={notification.type as any} closable onClose={handleNotificationClose}>
            {notification.text}
          </Notification>
        )}
      </NotificationGroup>
    </main>
  );
};

export default Dashboard;
