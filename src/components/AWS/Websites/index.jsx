import React, { useState } from 'react';
import { Globe, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../../Common/index.jsx';

export const WebsiteCard = ({ website }) => {
  const [expanded, setExpanded] = useState(false);
  const isHealthy = website.http_code === 200;
  const responseTimeStatus = website.response_time < 200 ? 'Fast' : website.response_time < 500 ? 'Normal' : 'Slow';
  const timeColor = website.response_time > 500 ? 'text-red-500' : website.response_time > 200 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="w-full p-4 flex items-start justify-between hover:bg-gray-50"
      >
        <div className="flex items-start gap-3 flex-1">
          <Globe size={24} className="text-green-600 flex-shrink-0 mt-1" />
          <div className="text-left">
            <h3 className="font-bold text-gray-900 text-lg">{website.url}</h3>
            <p className="text-xs text-gray-500 mt-1">Website Monitor</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={website.status} size="sm" />
          <ChevronDown size={20} className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-200 space-y-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${isHealthy ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isHealthy ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <AlertCircle size={16} className="text-red-600" />
                )}
                <span className="text-xs font-semibold text-gray-700">HTTP Status</span>
              </div>
              <p className={`text-2xl font-bold ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>{website.http_code}</p>
            </div>

            <div className={`p-3 rounded-lg ${website.response_time < 500 ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-gray-700">Response Time</span>
              </div>
              <p className={`text-2xl font-bold ${timeColor}`}>{website.response_time}ms</p>
              <p className="text-xs text-gray-600 mt-1">{responseTimeStatus}</p>
            </div>
          </div>

          <div className="bg-white rounded p-3 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Health Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-semibold text-gray-900">99.9%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Check:</span>
                <span className="font-semibold text-gray-900">Just now</span>
              </div>
            </div>
          </div>

          {!isHealthy && (
            <div className="bg-red-50 border border-red-200 rounded p-2 flex gap-2">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-700">Website is down or unreachable</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const WebsiteList = ({ websites }) => {
  if (!websites || websites.length === 0) {
    return <p className="text-center text-gray-500 py-8">No websites configured</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {websites.map((website, idx) => (
        <WebsiteCard key={idx} website={website} />
      ))}
    </div>
  );
};