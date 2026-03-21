import { useState, useEffect } from 'react';
import { MONITORING_URLS } from '../utils/monitoringConfig';

export const useHealthMonitor = () => {
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0, uptime: 0 });

  useEffect(() => {
    const checkServices = async () => {
      const checks = await Promise.allSettled(
        MONITORING_URLS.map(async (service) => {
          try {
            const start = Date.now();
            const response = await fetch(service.url, {
              method: 'GET',
              signal: AbortSignal.timeout(8000),
            });
            const responseTime = Date.now() - start;
            const statusCode = response.status;
            const isOnline = statusCode >= 200 && statusCode < 300;
            
            return { 
              ...service, 
              isOnline, 
              responseTime, 
              statusCode 
            };
          } catch (error) {
            let statusCode = 'ERROR';
            if (error.name === 'AbortError') {
              statusCode = 'TIMEOUT';
            } else if (error.message.includes('Failed to fetch')) {
              statusCode = 'CORS_ERROR';
            }
            
            return { 
              ...service, 
              isOnline: false, 
              responseTime: null, 
              statusCode 
            };
          }
        })
      );

      const results = checks.map((c) => 
        c.status === 'fulfilled' ? c.value : { ...c.reason, isOnline: false, statusCode: 'FAILED' }
      );
      setServices(results);

      const online = results.filter((s) => s.isOnline).length;
      setStats({
        total: results.length,
        online,
        offline: results.length - online,
        uptime: ((online / results.length) * 100).toFixed(2),
      });
    };

    checkServices();
    const interval = setInterval(checkServices, 5000);
    return () => clearInterval(interval);
  }, []);

  return { services, stats };
};
