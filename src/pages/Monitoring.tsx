import React, { useEffect, useState } from "react";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import { Notification } from "@progress/kendo-react-notification";
import { CircularGauge } from "@progress/kendo-react-gauges";
import { Upload } from "@progress/kendo-react-upload";
import { ListView } from "@progress/kendo-react-listview";
import { OrgChart } from "@progress/kendo-react-orgchart";
import { Button } from "@progress/kendo-react-buttons";
import { Dialog } from "@progress/kendo-react-dialogs";
import { incidents as staticIncidents, Incident } from "../data/incidents";
import { useI18n } from "../i18n";

const getLiveIncidents = () => {
  // Simulate real-time updates by shuffling and adding a new incident every 5s
  const stored = localStorage.getItem("incidents");
  let data: Incident[] = stored ? JSON.parse(stored) : staticIncidents;
  return data;
};

const Monitoring: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(0);
  const [incidents, setIncidents] = useState<Incident[]>(getLiveIncidents());
  const [showDialog, setShowDialog] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Timer and progress simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => t + 1);
      setProgress((p) => (p >= 100 ? 0 : p + 10));
      setIncidents(getLiveIncidents());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Example OrgChart data
  const orgData = [
    { id: 1, name: "Mine Supervisor", title: "Supervisor", avatar:
      'https://demos.telerik.com/kendo-ui/content/web/treelist/people/1.jpg',
    },
    { id: 2, name: "Safety Officer", title: "Officer", parentId: 1, avatar:
      'https://demos.telerik.com/kendo-ui/content/web/treelist/people/2.jpg',
    },
    { id: 3, name: "Worker", title: "Worker", parentId: 2, avatar:
      'https://demos.telerik.com/kendo-ui/content/web/treelist/people/3.jpg',
    },
  ];

  const { t } = useI18n();
  return (
  <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:ml-64 mt-14 min-h-screen bg-white dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{t("realTimeMonitoring")}</h1>
        <div className="mb-4">
          <span className="font-semibold">{t("systemUptime")} </span>
          <span>{Math.floor(timer / 60)}m {timer % 60}s</span>
        </div>
        <div className="mb-4 rounded-lg shadow">
          <ProgressBar value={progress} labelVisible={true} style={{ height: 24, borderRadius: 12 }} />
        </div>
        <Button className="mt-4 rounded-lg shadow" onClick={() => setShowDialog(true)} themeColor="primary">{t("showDetails")}</Button>
        {showDialog && (
          <Dialog title={t("liveSystemDetails")} onClose={() => setShowDialog(false)}>
            <div>{t("currentProgress")} {progress}%</div>
            <div>{t("incidentsInSystem")} {incidents.length}</div>
            <Button themeColor={"primary"} onClick={() => setShowDialog(false)} className="mt-4 rounded-lg shadow">{t("close")}</Button>
          </Dialog>
        )}
        {notification && (
          <Notification closable onClose={() => setNotification(null)}>
            <span style={{ marginTop: 16 }}>{notification}</span>
          </Notification>
        )}
        <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">{t("uploadReport")}</h2>
          <Upload defaultFiles={[]} multiple={false} onAdd={() => setNotification("Report uploaded!")} />
        </div>
        <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">{t("orgChart")}</h2>
          <OrgChart style={{ height: 200, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }} data={orgData} />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-2">{t("liveIncidentsList")}</h2>
        <div className="rounded-lg shadow mb-8">
          <ListView
            data={incidents}
            item={(props) => (
              <div className="border-b py-2 px-2 flex flex-col last:border-b-0">
                <span className="font-bold text-red-600">{props.dataItem.type}</span>
                <span className="text-xs text-gray-500">{props.dataItem.date}</span>
                <span>{props.dataItem.description}</span>
                <span className="text-xs text-gray-700">{t("reporter")}: {props.dataItem.reporter}</span>
              </div>
            )}
            style={{ maxHeight: 300, overflowY: "auto", background: "#fff", borderRadius: 8 }}
          />
        </div>
        <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg shadow p-4 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">{t("liveGauge")}</h2>
          <CircularGauge value={progress} />
        </div>
      </div>
    </div>
  )
};
export default Monitoring;
