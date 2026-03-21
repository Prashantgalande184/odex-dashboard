import React from 'react';
import { useHealthMonitor } from '../../hooks/useHealthMonitor';

export const HealthMonitor = () => {
  const { services, stats } = useHealthMonitor();

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <h1 style={{ color: '#333' }}>🔍 Service Health Monitor</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#1976d2', margin: 0 }}>Total</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2', margin: '10px 0 0 0' }}>{stats.total}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f1f8f4', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#4CAF50', margin: 0 }}>Online</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50', margin: '10px 0 0 0' }}>{stats.online}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#fff3f1', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#f44336', margin: 0 }}>Offline</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336', margin: '10px 0 0 0' }}>{stats.offline}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#fef3e2', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#ff9800', margin: 0 }}>Uptime</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800', margin: '10px 0 0 0' }}>{stats.uptime}%</p>
        </div>
      </div>

      {/* Service Grid */}
      <h2>Service Status</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
        {services.map((service) => (
          <div
            key={service.url}
            style={{
              border: 2px solid ,
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: service.isOnline ? '#f1f8f4' : '#fff3f1',
              textAlign: 'center',
            }}
          >
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{service.name}</h4>
            <p style={{ margin: '5px 0', fontWeight: 'bold', color: service.isOnline ? '#4CAF50' : '#f44336' }}>
              {service.isOnline ? '🟢 Online' : '🔴 Down'}
              <span style={{ marginLeft: '5px', fontSize: '14px' }}>
                [{service.statusCode}]
              </span>
            </p>
            {service.responseTime && (
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                ⏱️ {service.responseTime}ms
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthMonitor;
