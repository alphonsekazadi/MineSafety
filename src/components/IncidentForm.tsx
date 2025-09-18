import React, { useState } from "react";
import { useI18n } from "../i18n";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { Input, TextArea } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";

const typeOptions = ["Injury", "Equipment", "Near-Miss", "Environmental"];
const severityOptions = ["Low", "Medium", "High", "Critical"];

export interface IncidentFormProps {
  onSubmit: (incident: any) => void;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState({
    date: new Date(),
    location: "",
    type: typeOptions[0],
    severity: severityOptions[0],
    description: "",
    reporter: ""
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Check if all fields are filled
  const isFormValid =
    form.date &&
    form.location.trim() !== "" &&
    form.type &&
    form.severity &&
    form.description.trim() !== "" &&
    form.reporter.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSubmit(form);
    setForm({
      date: new Date(),
      location: "",
      type: typeOptions[0],
      severity: severityOptions[0],
      description: "",
      reporter: ""
    });
  };

  const { t } = useI18n();
  return (
    <form className="incident-form bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1">{t("date")}</label>
          <DatePicker value={form.date} onChange={e => handleChange("date", e.value)} format="yyyy-MM-dd" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">{t("location")}</label>
          <Input value={form.location} onChange={e => handleChange("location", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">{t("type")}</label>
          <DropDownList data={typeOptions} value={form.type} onChange={e => handleChange("type", e.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">{t("severity")}</label>
          <DropDownList data={severityOptions} value={form.severity} onChange={e => handleChange("severity", e.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold mb-1">{t("description")}</label>
          <TextArea value={form.description} onChange={e => handleChange("description", e.target.value)} rows={2} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold mb-1">{t("reporter")}</label>
          <Input value={form.reporter} onChange={e => handleChange("reporter", e.target.value)} />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="submit" themeColor="primary" disabled={!isFormValid}>
          {t("submit")}
        </Button>
      </div>
    </form>
  );
};

export default IncidentForm;
