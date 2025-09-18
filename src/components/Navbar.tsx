

import React, { useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
// @ts-ignore
import logo from "../assets/logo.svg";
import { useI18n } from "../i18n";


interface NavbarProps {
  onAddIncident: () => void;
  onExport: () => void;
  disableAddIncident?: boolean;
  disableExport?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onAddIncident, onExport, disableAddIncident, disableExport }) => {
  const { t } = useI18n();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Sidebar nav buttons (same as Sidebar)
  const navButtons = [
    { label: t("dashboard"), onClick: () => { window.location.pathname = "/"; setDrawerOpen(false); } },
    { label: t("settings"), onClick: () => { window.location.pathname = "/settings"; setDrawerOpen(false); } },
    { label: t("monitoring"), onClick: () => { window.location.pathname = "/monitoring"; setDrawerOpen(false); } },
  ];
  // Navbar action buttons
  const actionButtons = [
    { label: t("addIncident"), onClick: () => { onAddIncident(); setDrawerOpen(false); }, disabled: disableAddIncident, themeColor: "primary" as const },
    { label: t("export"), onClick: () => { onExport(); setDrawerOpen(false); }, disabled: disableExport, themeColor: "secondary" as const, fillMode: "outline" as const },
    { label: t("help"), onClick: () => setDrawerOpen(false), themeColor: "success" as const },
  ];
  return (
    <header 
      className="fixed top-0 left-0 right-0 h-14 bg-white/60 backdrop-blur-lg shadow-sm flex items-center px-4 md:pl-72 z-30" 
      role="banner"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <img src={logo} alt="MineSafe Logo" className="h-8 w-8" />
          <span className="font-semibold text-lg">MineSafe</span>
        </div>

        {/* Desktop buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <Button themeColor={"primary"} aria-label="Add Incident" onClick={onAddIncident} disabled={disableAddIncident}>{t("addIncident")}</Button>
          <Button themeColor={"secondary"} fillMode={"outline"} onClick={onExport} disabled={disableExport}>{t("export")}</Button>
          <Button themeColor={"success"}>{t("help")}</Button>
        </div>

        {/* Hamburger menu for mobile */}
        <button
          className="sm:hidden flex items-center justify-center h-10 w-10 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay with blur and fade */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" onClick={() => setDrawerOpen(false)} />
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-72 max-w-[90vw] bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-[slideInLeft_0.3s_ease] z-10">
            <div className="flex items-center gap-3 px-6 pt-6 pb-2 border-b border-gray-200 dark:border-gray-800">
              <img src={logo} alt="MineSafe Logo" className="h-8 w-8" />
              <span className="font-semibold text-lg">MineSafe</span>
              <button
                className="ml-auto text-2xl text-gray-700 dark:text-gray-200 hover:text-red-500 focus:outline-none"
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
              >
                ×
              </button>
            </div>
            <nav className="flex-1 flex flex-col gap-2 px-6 py-6">
              <div className="flex flex-col gap-2">
                {navButtons.map((btn) => (
                  <Button key={btn.label} className="w-full !justify-start" themeColor="primary" onClick={btn.onClick}>{btn.label}</Button>
                ))}
              </div>
              <div className="my-4 border-t border-gray-200 dark:border-gray-800" />
              <div className="flex flex-col gap-2">
                {actionButtons.map((btn) => (
                  <Button
                    key={btn.label}
                    className="w-full !justify-start"
                    themeColor={btn.themeColor}
                    fillMode={btn.fillMode}
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            </nav>
            <div className="px-6 pb-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
              © {new Date().getFullYear()} MineSafe
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;