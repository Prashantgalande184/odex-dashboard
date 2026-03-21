// src/pages/HealthMonitor.jsx
import React from 'react';
import { useHealthMonitor } from '../hooks/useHealthMonitor';

export default function HealthMonitor() {
  const { services, stats } = useHealthMonitor();

  if (!services || services.length === 0) {
    return <div className="p-8">Loading health data...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Service Health Monitor</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="text-gray-600 text-sm font-medium">Total</div>
          <div className="text-4xl font-bold text-blue-600 mt-2">{stats.total}</div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="text-gray-600 text-sm font-medium">Online</div>
          <div className="text-4xl font-bold text-green-600 mt-2">{stats.online}</div>
        </div>
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="text-gray-600 text-sm font-medium">Offline</div>
          <div className="text-4xl font-bold text-red-600 mt-2">{stats.offline}</div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="text-gray-600 text-sm font-medium">Uptime</div>
          <div className="text-4xl font-bold text-yellow-600 mt-2">{stats.uptime}%</div>
        </div>
      </div>

      {/* Service Status */}
      <h2 className="text-2xl font-bold mb-6">Service Status</h2>
      <div className="grid grid-cols-4 gap-4">
        {services.map((service, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border-2 ${
              service.status === 'online'
                ? 'bg-green-50 border-green-300'
                : 'bg-red-50 border-red-300'
            }`}
          >
            <div className="font-semibold text-center mb-3">{service.name}</div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  service.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span
                className={`font-bold ${
                  service.status === 'online' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {service.status === 'online' ? 'Online' : 'Down'}
              </span>
            </div>
            <div className="text-center text-sm text-gray-600">
              [{service.http_code}]
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">
              {service.response_time}ms
            </div>
          </div>
        ))}
      </div>

      {/* EC2 Section */}
      {stats.ec2 && stats.ec2.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">EC2 Instances ({stats.ec2.length})</h2>
          <div className="grid grid-cols-3 gap-4">
            {stats.ec2.map((instance, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="font-semibold">{instance.name}</div>
                <div className="text-sm text-gray-600 mt-2">
                  Status: <span className="font-medium">{instance.status}</span>
                </div>
                <div className="text-sm text-gray-600">
                  CPU: <span className="font-medium">{instance.cpu}%</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">Since: {instance.since}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RDS Section */}
      {stats.rds && stats.rds.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">RDS Databases ({stats.rds.length})</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.rds.map((db, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="font-semibold">{db.db_identifier}</div>
                <div className="text-sm text-gray-600 mt-2">
                  Engine: <span className="font-medium">{db.engine}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Status: <span className="font-medium">{db.status}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Storage: <span className="font-medium">{db.storage}GB</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EKS Section */}
      {stats.eks && stats.eks.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">EKS Clusters ({stats.eks.length})</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.eks.map((cluster, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="font-semibold">{cluster.name}</div>
                <div className="text-sm text-gray-600 mt-2">
                  Nodes: <span className="font-medium">{cluster.nodes}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Health: <span className={`font-medium ${cluster.health === 'Healthy' ? 'text-green-600' : 'text-yellow-600'}`}>{cluster.health}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}