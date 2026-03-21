import React, { useState, useEffect } from 'react';
import './styles/globals.css';
import { Dashboard } from './components/Dashboard/index.jsx';
// import { HealthMonitor } from './components/HealthMonitor/index.jsx';
import { initializeConnection } from './connection/ConnectionManager';
import { HealthMonitor } from './components/HealthMonitor';

function App() {
  const [currentView, setCurrentView] = useState('monitor');

  useEffect(() => {
    const conn = initializeConnection();
    console.log('✅ Connection initialized');
    console.log('Account:', conn.getAccountInfo());
  }, []);

  return (
    <div>
      {/* Navigation */}
      <div style={{ display: 'flex', gap: '10px', padding: '10px', backgroundColor: '#333' }}>
        <button
          onClick={() => setCurrentView('monitor')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === 'monitor' ? '#1976d2' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          📊 Health Monitor
        </button>
        <button
          onClick={() => setCurrentView('dashboard')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === 'dashboard' ? '#1976d2' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🎛️ Dashboard
        </button>
      </div>

      {/* Content */}
      {currentView === 'monitor' && <HealthMonitor />}
      {currentView === 'dashboard' && <Dashboard />}
    </div>
  );
}

export default App;