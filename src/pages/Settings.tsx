
import React from "react";
import { Switch } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { useI18n } from "../i18n";

const themes = [
  { name: "Default", css: "@progress/kendo-theme-default/dist/all.css" },
  { name: "Bootstrap", css: "@progress/kendo-theme-bootstrap/dist/all.css" },
  { name: "Material", css: "@progress/kendo-theme-material/dist/all.css" },
  { name: "Fluent", css: "@progress/kendo-theme-fluent/dist/all.css" },
];
const languages = ["English", "French"];

const Settings: React.FC = () => {
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem("kendo-theme") || themes[0].name;
  });
  const { language, setLanguage, t } = useI18n();
  const [darkMode, setDarkMode] = React.useState(() => {
    const stored = localStorage.getItem("dark-mode");
    return stored === "true";
  });

  // Dynamically load Kendo theme CSS
  React.useEffect(() => {
    const selected = themes.find(t => t.name === theme);
    if (!selected) return;
    // Remove any existing Kendo theme link
    const prev = document.getElementById("kendo-theme-link");
    if (prev) prev.remove();
    // Create new link
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.id = "kendo-theme-link";
    link.href = selected.css.startsWith("@progress/")
      ? `https://unpkg.com/${selected.css}`
      : selected.css;
    document.head.appendChild(link);
    // Persist theme
    localStorage.setItem("kendo-theme", theme);
  }, [theme]);

  // Dark mode effect
  React.useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("dark-mode", darkMode ? "true" : "false");
  }, [darkMode]);

  return (
    <div className="p-8 md:ml-64 mt-14 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{t("settings")}</h1>
      <div className="max-w-lg space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">{t("theme")}</label>
          <DropDownList
            data={themes.map(t => t.name)}
            value={theme}
            onChange={e => setTheme(e.value)}
            style={{ minWidth: 180 }}
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">{t("language")}</label>
          <DropDownList data={languages} value={language} onChange={e => setLanguage(e.value)} style={{ minWidth: 180 }} />
        </div>
        <div className="flex items-center gap-4">
          <label className="font-semibold text-gray-800 dark:text-gray-200">{t("darkMode")}</label>
          <Switch checked={darkMode} onChange={e => setDarkMode(e.value)} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
