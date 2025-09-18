import { createContext, useContext, useState, ReactNode } from "react";

type Language = "English" | "French";

const translations: Record<Language, Record<string, string>> = {
  English: {
  chatbotInitial: "Hi! I can help you filter incidents or answer questions. Try: 'Show critical incidents', 'How many incidents today?', 'What is the most common incident type?', 'Filter by location: Main Shaft', or 'Help'.",
  chatbotHelp: `🤖 **Available Commands:**\n\n• **Filter by severity:** \"Show critical/high/medium/low incidents\"\n• **Filter by time:** \"Show incidents from today/yesterday/this week/this month\"\n• **Filter by location:** \"Show incidents at Main Shaft\" or \"Filter by location: Tunnel B\"\n• **Filter by type:** \"Show equipment incidents\" or \"Filter by type: Injury\"\n• **Statistics:** \"How many incidents today?\" or \"Most common incident type?\"\n• **Clear filters:** \"Clear filters\" or \"Reset filters\"\n• **General help:** \"Help\" or \"What can you do?\"`,
    dashboard: "Dashboard",
    monitoring: "Monitoring",
    settings: "Settings",
    addIncident: "Add Incident",
    export: "Export",
    help: "Help",
    totalIncidents: "Total incidents",
    criticalIncidents: "Critical incidents",
    highSeverity: "High severity",
    incidentAdding: "Incident adding",
    incidentsByType: "Incidents by Type",
    severityDistribution: "Severity Distribution",
    incidentsByMonth: "Incidents by Month",
    topLocations: "Top Locations",
    quickActions: "Quick actions",
    startInvestigation: "Start investigation",
    emergencyProtocols: "Emergency protocols",
    downloadAllData: "Download All Data",
    chooseFormat: "Choose the format to download all incident data:",
    pdf: "PDF",
    excel: "Excel",
    cancel: "Cancel",
    addNewIncident: "Add New Incident",
    incidentCreated: "Incident created!",
    realTimeMonitoring: "Real-Time Monitoring",
    systemUptime: "System Uptime:",
    showDetails: "Show Details",
    liveSystemDetails: "Live System Details",
    currentProgress: "Current Progress:",
    incidentsInSystem: "Incidents in system:",
    close: "Close",
    uploadReport: "Upload Report",
    orgChart: "Org Chart",
    liveIncidentsList: "Live Incidents List",
    liveGauge: "Live Gauge",
    theme: "Theme",
    language: "Language",
    darkMode: "Dark Mode",
    date: "Date",
    location: "Location",
    type: "Type",
    severity: "Severity",
    description: "Description",
    reporter: "Reporter",
    submit: "Add Incident",
    filters: "Filters",
    startDate: "Start Date",
    endDate: "End Date",
    all: "All",
  },
  French: {
  chatbotInitial: "Salut ! Je peux vous aider à filtrer les incidents ou à répondre à vos questions. Essayez : 'Afficher les incidents critiques', 'Combien d'incidents aujourd'hui ?', 'Quel est le type d'incident le plus courant ?', 'Filtrer par lieu : Main Shaft' ou 'Aide'.",
  chatbotHelp: `🤖 **Commandes disponibles :**\n\n• **Filtrer par gravité :** \"Afficher les incidents critiques/élevés/moyens/faibles\"\n• **Filtrer par période :** \"Afficher les incidents d'aujourd'hui/d'hier/cette semaine/ce mois\"\n• **Filtrer par lieu :** \"Afficher les incidents à Main Shaft\" ou \"Filtrer par lieu : Tunnel B\"\n• **Filtrer par type :** \"Afficher les incidents d'équipement\" ou \"Filtrer par type : Blessure\"\n• **Statistiques :** \"Combien d'incidents aujourd'hui ?\" ou \"Type d'incident le plus courant ?\"\n• **Effacer les filtres :** \"Effacer les filtres\" ou \"Réinitialiser les filtres\"\n• **Aide générale :** \"Aide\" ou \"Que peux-tu faire ?\"`,
    dashboard: "Tableau de bord",
    monitoring: "Surveillance",
    settings: "Paramètres",
    addIncident: "Ajouter un incident",
    export: "Exporter",
    help: "Aide",
    totalIncidents: "Incidents totaux",
    criticalIncidents: "Incidents critiques",
    highSeverity: "Gravité élevée",
    incidentAdding: "Ajout d'incident",
    incidentsByType: "Incidents par type",
    severityDistribution: "Répartition par gravité",
    incidentsByMonth: "Incidents par mois",
    topLocations: "Lieux principaux",
    quickActions: "Actions rapides",
    startInvestigation: "Démarrer l'enquête",
    emergencyProtocols: "Protocoles d'urgence",
    downloadAllData: "Télécharger toutes les données",
    chooseFormat: "Choisissez le format pour télécharger toutes les données d'incident :",
    pdf: "PDF",
    excel: "Excel",
    cancel: "Annuler",
    addNewIncident: "Ajouter un nouvel incident",
    incidentCreated: "Incident créé !",
    realTimeMonitoring: "Surveillance en temps réel",
    systemUptime: "Temps de fonctionnement du système :",
    showDetails: "Afficher les détails",
    liveSystemDetails: "Détails du système en direct",
    currentProgress: "Progression actuelle :",
    incidentsInSystem: "Incidents dans le système :",
    close: "Fermer",
    uploadReport: "Télécharger le rapport",
    orgChart: "Organigramme",
    liveIncidentsList: "Liste des incidents en direct",
    liveGauge: "Jauge en direct",
    theme: "Thème",
    language: "Langue",
    darkMode: "Mode sombre",
    date: "Date",
    location: "Lieu",
    type: "Type",
    severity: "Gravité",
    description: "Description",
    reporter: "Rapporteur",
    submit: "Ajouter l'incident",
    filters: "Filtres",
    startDate: "Date de début",
    endDate: "Date de fin",
    all: "Tous",
  },
};

interface I18nContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextProps>({
  language: "English",
  setLanguage: () => {},
  t: (key) => key,
});

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("language") as Language) || "English";
  });
  const t = (key: string) => translations[language][key] || key;
  const setLang = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };
  return (
    <I18nContext.Provider value={{ language, setLanguage: setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);