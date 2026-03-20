import React from 'react';
import { AlertCircle, X, Search } from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const getStatusColor = () => {
    const s = status?.toLowerCase() || '';
    if (['running', 'available', 'online', 'healthy', 'active'].includes(s)) return 'bg-green-100 text-green-800 border-green-300';
    if (['stopped', 'offline', 'failed', 'error'].includes(s)) return 'bg-red-100 text-red-800 border-red-300';
    if (['warning', 'pending'].includes(s)) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };
  const sizeClasses = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm', lg: 'px-4 py-2 text-base' };
  return <span className={`${sizeClasses[size]} rounded-full font-semibold border ${getStatusColor()}`}>{status}</span>;
};

export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600 text-sm">{message}</p>
  </div>
);

export const ErrorAlert = ({ error, onClose }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-4">
    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="font-semibold text-red-900">Error</p>
      <p className="text-sm text-red-700 mt-1">{error}</p>
    </div>
    {onClose && <button onClick={onClose}><X size={18} /></button>}
  </div>
);

export const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-300">
    <Search size={18} className="text-gray-400" />
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="bg-transparent flex-1 text-gray-900 placeholder-gray-500 outline-none text-sm" />
    {value && <button onClick={() => onChange('')}><X size={16} /></button>}
  </div>
);

export const TabNavigation = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-2 border-b border-gray-200">
    {tabs.map(tab => {
      const TabIcon = tab.icon;
      return (
        <button key={tab.id} onClick={() => onChange(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition ${activeTab === tab.id ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent'}`}>
          {TabIcon && <TabIcon size={16} />}
          {tab.label}
          {tab.count !== undefined && <span className="bg-gray-100 px-2 py-0.5 rounded text-xs ml-1">{tab.count}</span>}
        </button>
      );
    })}
  </div>
);