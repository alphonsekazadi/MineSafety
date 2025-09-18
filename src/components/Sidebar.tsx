// src/components/Sidebar.tsx
import React from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Switch } from "@progress/kendo-react-inputs";
//import { Map } from "@progress/kendo-svg-icons";

const Sidebar: React.FC = () => {
  return (
    <aside
      className="hidden md:flex md:flex-col w-64 bg-gray-800 text-white p-4 min-h-screen fixed left-0 top-0 z-40"
      aria-label="Sidebar"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 font-bold">
          MS
        </div>
        <div className="flex items-center ml-auto">
          <span className="mr-2 text-sm">Dark Mode</span>
          <Switch
            checked={document.documentElement.classList.contains('dark')}
            onChange={() => {
              const isDark = document.documentElement.classList.toggle('dark');
              localStorage.setItem('theme', isDark ? 'dark' : 'light');
            }}
            aria-label="Toggle dark mode"
          />
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Button fillMode="solid" themeColor={"primary"} className="w-full justify-start" aria-label="Dashboard button">
              Dashboard
            </Button>
          </li>
          <li>
            <Button fillMode="solid" themeColor={"primary"} className="w-full justify-start" aria-label="Incidents button">
              Incidents
            </Button>
          </li>
          <li>
            <Button fillMode="solid" themeColor={"primary"} className="bg-blue-300 w-full justify-start" aria-label="Maintenance button">
              Maintenance
            </Button>
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
