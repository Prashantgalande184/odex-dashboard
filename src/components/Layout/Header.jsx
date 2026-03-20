import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { getConnection } from '../../connection/ConnectionManager';
import { DataStatusBadge } from '../Common/DataStatusBadge.jsx';

export const Header = ({ onRefresh, loading, isUsingMockData, lastUpdated }) => {
  const [accountInfo, setAccountInfo] = useState(null);

  useEffect(() => {
    const conn = getConnection();
    setAccountInfo(conn.getAccountInfo());
  }, []);

  const timeAgo = lastUpdated ? Math.round((Date.now() - lastUpdated) / 1000) : 0;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🚀 Odex Infra Dashboard - Built by Prashant</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-xs text-gray-600">Account: {accountInfo?.accountId}</p>
            <DataStatusBadge isUsingMockData={isUsingMockData} lastUpdated={lastUpdated} />
            <p className="text-xs text-gray-500">Updated {timeAgo}s ago</p>
          </div>
        </div>
        <button 
          onClick={onRefresh} 
          disabled={loading} 
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
    </header>
  );
};