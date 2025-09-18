import React, { useRef, useState } from "react";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { incidents } from "../data/incidents";
import { process, State } from "@progress/kendo-data-query";
import { Button, DropDownButton } from "@progress/kendo-react-buttons";
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { PDFExport } from '@progress/kendo-react-pdf';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';

interface ProcessedData {
  data: any[];
  total: number;
}


const typeOptions = ["All", "Injury", "Equipment", "Near-Miss", "Environmental"];
const severityOptions = ["All", "Low", "Medium", "High", "Critical"];

interface IncidentGridProps {
  pdfExportTrigger?: (cb: () => void) => void;
  excelExportTrigger?: (cb: () => void) => void;
}

const IncidentGrid: React.FC<IncidentGridProps> = ({ pdfExportTrigger, excelExportTrigger }) => {
  const [dataState, setDataState] = useState<State>({
    take: 7,
    skip: 0,
    sort: [{ field: "date", dir: "desc" as const }],
  });
  const pdfExportRef = useRef<any>(null);
  const excelExportRef = useRef<any>(null);

  // Filter states
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [severityFilter, setSeverityFilter] = useState<string>("All");

  // Filtering logic
  const filteredIncidents = incidents.filter((incident) => {
    const incidentDate = new Date(incident.date);
    const afterStart = !startDate || incidentDate >= startDate;
    const beforeEnd = !endDate || incidentDate <= endDate;
    const typeMatch = typeFilter === "All" || incident.type === typeFilter;
    const severityMatch = severityFilter === "All" || incident.severity === severityFilter;
    return afterStart && beforeEnd && typeMatch && severityMatch;
  });

  const processed = process(filteredIncidents, dataState);

  const DateCell = (props: any) => (
    <td>{new Date(props.dataItem.date).toLocaleString()}</td>
  );


  // Export handlers for parent
  React.useEffect(() => {
    if (pdfExportTrigger) pdfExportTrigger(() => pdfExportRef.current.save());
    if (excelExportTrigger) excelExportTrigger(() => excelExportRef.current.save());
  }, [pdfExportTrigger, excelExportTrigger]);

  const handleExportToPDF = () => {
    pdfExportRef.current.save();
  };

  const handleExportToExcel = () => {
    excelExportRef.current.save();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block text-xs font-semibold mb-1">Start Date</label>
          <DatePicker value={startDate} onChange={e => setStartDate(e.value)} format="yyyy-MM-dd" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">End Date</label>
          <DatePicker value={endDate} onChange={e => setEndDate(e.value)} format="yyyy-MM-dd" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Type</label>
          <DropDownList
            data={typeOptions}
            value={typeFilter}
            onChange={e => setTypeFilter(e.value)}
            style={{ minWidth: 120 }}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Severity</label>
          <DropDownList
            data={severityOptions}
            value={severityFilter}
            onChange={e => setSeverityFilter(e.value)}
            style={{ minWidth: 120 }}
          />
        </div>
      </div>

      <PDFExport ref={pdfExportRef} fileName="Incidents_Report.pdf">
        <Grid
          style={{ height: "420px" }}
          data={processed.data}
          total={processed.total}
          pageable={true}
          sortable={true}
          {...dataState}
          onDataStateChange={(e) => {
            if (e.dataState) {
              setDataState(e.dataState);
            }
          }}
        >
          {/* No toolbar, export and add moved to Navbar */}
          <GridColumn field="id" title="#" width="60px" />
          <GridColumn field="date" title="Date" cells={{ data: DateCell }} />
          <GridColumn field="location" title="Location" />
          <GridColumn field="type" title="Type" />
          <GridColumn field="severity" title="Severity" />
          <GridColumn field="reporter" title="Reporter" />
          <GridColumn field="description" title="Description" />
        </Grid>
      </PDFExport>

      <ExcelExport ref={excelExportRef} data={processed.data} fileName="Incidents_Report.xlsx">
        <Grid
          style={{ display: "none" }}
          data={processed.data}
          total={processed.total}
        >
          <GridColumn field="id" title="#" />
          <GridColumn field="date" title="Date" />
          <GridColumn field="location" title="Location" />
          <GridColumn field="type" title="Type" />
          <GridColumn field="severity" title="Severity" />
          <GridColumn field="reporter" title="Reporter" />
          <GridColumn field="description" title="Description" />
        </Grid>
      </ExcelExport>
    </div>
  );
};

export default IncidentGrid;