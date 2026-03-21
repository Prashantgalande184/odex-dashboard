import React from 'react';
import { useHealthMonitor } from '../../hooks/useHealthMonitor';

export const HealthMonitor = () => {
  const { services, stats } = useHealthMonitor();

  const handleServiceClick = (url) => {
    window.open(url, '_blank');
  };

  const getStatusColor = (statusCode) => {
    if (typeof statusCode === 'number') {
      if (statusCode >= 200 && statusCode < 300) return '#4CAF50';
      if (statusCode >= 300 && statusCode < 400) return '#2196F3';
      if (statusCode >= 400 && statusCode < 500) return '#FF9800';
      return '#f44336';
    }
    return '#f44336';
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#333' }}>🔍 Service Health Monitor</h1>

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

      <h2>Service Status</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
        {services.map((service) => (
          <div
            key={service.url}
            onClick={() => handleServiceClick(service.url)}
            style={{
              border: service.isOnline ? '2px solid #4CAF50' : '2px solid #f44336',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: service.isOnline ? '#f1f8f4' : '#fff3f1',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{service.name}</h4>
            <p style={{ 
              margin: '5px 0', 
              fontWeight: 'bold', 
              color: service.isOnline ? '#4CAF50' : '#f44336',
              fontSize: '16px'
            }}>
              {service.isOnline ? '🟢 Online' : '🔴 Down'}
            </p>
            <p style={{ 
              margin: '8px 0', 
              fontWeight: 'bold', 
              fontSize: '18px',
              color: getStatusColor(service.statusCode),
              backgroundColor: 'rgba(0,0,0,0.05)',
              padding: '8px',
              borderRadius: '4px'
            }}>
              [{service.statusCode}]
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
