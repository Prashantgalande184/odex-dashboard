import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DataStatusBadge = ({ isUsingMockData, lastUpdated }) => {
  if (!isUsingMockData) {
    return (
      <div className="text-xs text-green-600 flex items-center gap-1">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        Live Data
      </div>
    );
  }

  return (
    <div className="text-xs text-yellow-600 flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
      <AlertCircle size={12} />
      Using Demo Data
    </div>
  );
};