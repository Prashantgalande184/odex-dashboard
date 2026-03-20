import React, { useState } from 'react';
import { Server, Cpu, Clock, ChevronDown, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../../Common/index.jsx';

export const EC2Card = ({ instance }) => {
  const [expanded, setExpanded] = useState(false);
  const cpuColor = instance.cpu > 70 ? 'text-red-500' : instance.cpu > 50 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="w-full p-4 flex items-start justify-between hover:bg-gray-50"
      >
        <div className="flex items-start gap-3 flex-1">
          <Server size={24} className="text-blue-600 flex-shrink-0 mt-1" />
          <div className="text-left">
            <h3 className="font-bold text-gray-900 text-lg">{instance.name || instance.instance_id}</h3>
            <p className="text-xs text-gray-500 mt-1">{instance.instance_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={instance.status} size="sm" />
          <ChevronDown 
            size={20} 
            className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-200 space-y-4 bg-gray-50">
          {/* CPU Status */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu size={18} className={cpuColor} />
                <span className="text-sm font-semibold text-gray-700">CPU Usage</span>
              </div>
              <span className={`text-2xl font-bold ${cpuColor}`}>{instance.cpu}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div 
                className={`h-full rounded-full ${
                  instance.cpu > 70 ? 'bg-red-500' : 
                  instance.cpu > 50 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${instance.cpu}%` }}
              ></div>
            </div>
          </div>

          {/* Launch Time */}
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className="text-gray-500" />
            <span className="text-gray-700">Launched: <span className="font-semibold">{instance.since}</span></span>
          </div>

          {/* Type */}
          <div className="text-sm">
            <span className="text-gray-600">Instance Type:</span>
            <span className="font-semibold text-gray-900 ml-2">{instance.type || 't2.micro'}</span>
          </div>

          {/* Warning if CPU high */}
          {instance.cpu > 70 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 flex gap-2">
              <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-yellow-700">High CPU usage detected</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const EC2List = ({ instances }) => {
  if (!instances || instances.length === 0) {
    return <p className="text-center text-gray-500 py-8">No EC2 instances found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {instances.map((instance, idx) => (
        <EC2Card key={idx} instance={instance} />
      ))}
    </div>
  );
};