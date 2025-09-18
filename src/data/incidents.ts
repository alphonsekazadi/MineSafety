// src/data/incidents.ts
export type Incident = {
  id: number;
  date: string; // ISO
  location: string;
  type: "Injury" | "Equipment" | "Near-Miss" | "Environmental";
  severity: "Low" | "Medium" | "High" | "Critical";
  description: string;
  reporter: string;
};

export const incidents: Incident[] = [
  {
    id: 1,
    date: "2025-09-10T09:30:00Z",
    location: "Kamituga",
    type: "Injury",
    severity: "High",
    description: "Worker slipped in wet area; fracture suspected.",
    reporter: "Jean M.",
  },
  {
    id: 2,
    date: "2025-09-12T13:20:00Z",
    location: "Kolwezi",
    type: "Equipment",
    severity: "Medium",
    description: "Hydraulic leak on excavator #EX21.",
    reporter: "Amina K.",
  },
  {
    id: 3,
    date: "2025-09-14T07:45:00Z",
    location: "Likasi",
    type: "Near-Miss",
    severity: "Low",
    description: "Loose rockfall near conveyor, no injuries.",
    reporter: "Paul T.",
  },
  {
    id: 4,
    date: "2025-09-15T16:00:00Z",
    location: "Kolwezi",
    type: "Environmental",
    severity: "Critical",
    description: "Spill near tailings pond, requires containment.",
    reporter: "Ops Team",
  },
  // add more sample rows...
];
