// src/components/StatsCard.tsx
import React from "react";
import { ProgressBar} from "@progress/kendo-react-progressbars";

type Props = {
  title: string;
  value: string | number;
  children?: React.ReactNode;
};

const StatsCard: React.FC<Props> = ({ title, value, children }) => {
  // Convert value to number for ProgressBar, fallback to 0 if not possible
  const numericValue = typeof value === "number" ? value : parseFloat(value) || 0;

  return (
    <div className="bg-gray-700 dark:bg-gray-800 rounded-lg shadow p-4 text-white dark:text-gray-100 transition-colors duration-300">
      <div className="text-sm font-bold text-white dark:text-gray-100">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-2">
        <ProgressBar value={numericValue} />
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
};

export default StatsCard;
