// src/components/Sidebar.tsx
import React from "react";
import { Button } from "@progress/kendo-react-buttons";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  return (
    <aside
      className="hidden md:flex md:flex-col w-64 bg-gray-800 text-white dark:bg-gray-950 dark:text-gray-100 p-4 min-h-screen fixed left-0 top-0 z-40 transition-colors duration-300"
      aria-label="Sidebar"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 font-bold">
          MS
        </div>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Button fillMode="solid" themeColor={"primary"} className="w-full justify-start" aria-label="Dashboard button" onClick={() => navigate("/")}>{t("dashboard")}</Button>
          </li>
          <li>
            <Button fillMode="solid" themeColor={"primary"} className="w-full justify-start" aria-label="Settings button" onClick={() => navigate("/settings")}>{t("settings")}</Button>
          </li>
          <li>
            <Button fillMode="solid" themeColor={"primary"} className="w-full justify-start" aria-label="Monitoring button" onClick={() => navigate("/monitoring")}>{t("monitoring")}</Button>
          </li>
        </ul>
      </nav>

      <footer className="mt-auto text-sm opacity-90">
        <div>© {new Date().getFullYear()} MineSafe</div>
        <div className="text-xs">Accessible · Responsive</div>
      </footer>
    </aside>
  );
};

export default Sidebar;
