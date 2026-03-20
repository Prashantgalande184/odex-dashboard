import React, { useState } from 'react';
import { Database, HardDrive, Clock, ChevronDown, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../../Common/index.jsx';

export const RDSCard = ({ database }) => {
  const [expanded, setExpanded] = useState(false);
  const storagePercent = (database.used_storage / database.storage) * 100 || 30;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="w-full p-4 flex items-start justify-between hover:bg-gray-50"
      >
        <div className="flex items-start gap-3 flex-1">
          <Database size={24} className="text-purple-600 flex-shrink-0 mt-1" />
          <div className="text-left">
            <h3 className="font-bold text-gray-900 text-lg">{database.db_identifier}</h3>
            <p className="text-xs text-gray-500 mt-1">{database.engine}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={database.status} size="sm" />
          <ChevronDown size={20} className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-200 space-y-4 bg-gray-50">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive size={18} className="text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">Storage</span>
              </div>
              <span className="text-lg font-bold text-purple-600">{database.storage} GB</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div 
                className="h-full rounded-full bg-purple-500"
                style={{ width: `${storagePercent}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">{storagePercent.toFixed(0)}% used</p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className="text-gray-500" />
            <span className="text-gray-700">Created: <span className="font-semibold">{database.since}</span></span>
          </div>

          <div className="text-sm">
            <span className="text-gray-600">Multi-AZ:</span>
            <span className="font-semibold text-gray-900 ml-2">{database.multi_az ? 'Yes' : 'No'}</span>
          </div>

          {storagePercent > 80 && (
            <div className="bg-red-50 border border-red-200 rounded p-2 flex gap-2">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-700">Storage running low</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const RDSList = ({ databases }) => {
  if (!databases || databases.length === 0) {
    return <p className="text-center text-gray-500 py-8">No RDS instances found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {databases.map((db, idx) => (
        <RDSCard key={idx} database={db} />
      ))}
    </div>
  );
};