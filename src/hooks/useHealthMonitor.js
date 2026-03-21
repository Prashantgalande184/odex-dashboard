import { useState, useEffect } from 'react';

export const useHealthMonitor = () => {
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0, uptime: 0 });

  useEffect(() => {
    const checkServices = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/health-check');
        const results = await response.json();
        
        setServices(results);

        const online = results.filter((s) => s.isOnline).length;
        setStats({
          total: results.length,
          online,
          offline: results.length - online,
          uptime: ((online / results.length) * 100).toFixed(2),
        });
      } catch (error) {
        console.error('Failed to fetch health check:', error);
      }
    };

    checkServices();
    const interval = setInterval(checkServices, 5000);
    return () => clearInterval(interval);
  }, []);

  return { services, stats };
};
