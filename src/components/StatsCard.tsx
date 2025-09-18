// src/components/StatsCard.tsx
import React from "react";

type Props = {
  title: string;
  value: string | number;
  children?: React.ReactNode;
};

const StatsCard: React.FC<Props> = ({ title, value, children }) => {
  return (
    <div className="bg-blue-100 rounded-lg shadow p-4">
      <div className="text-sm font-bold text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
};

export default StatsCard;
