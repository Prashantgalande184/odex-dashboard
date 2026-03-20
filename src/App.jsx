import React, { useEffect } from 'react';
import './styles/globals.css';
import { Dashboard } from './components/Dashboard/index.jsx';
import { initializeConnection } from './connection/ConnectionManager';

function App() {
  useEffect(() => {
    const conn = initializeConnection();
    console.log('✅ Connection initialized');
    console.log('Account:', conn.getAccountInfo());
  }, []);

  return <Dashboard />;
}

export default App;