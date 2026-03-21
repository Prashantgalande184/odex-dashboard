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
              method: 'HEAD',
              mode: 'no-cors',
              signal: AbortSignal.timeout(5000),
            });
            const responseTime = Date.now() - start;
            return { ...service, isOnline: true, responseTime, statusCode: 200 };
          } catch (error) {
            return { ...service, isOnline: false, responseTime: null, statusCode: 'ERROR' };
          }
        })
      );

      const results = checks.map((c) => (c.status === 'fulfilled' ? c.value : { ...c, isOnline: false, statusCode: 'TIMEOUT' }));
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
    const interval = setInterval(checkServices, 30000);
    return () => clearInterval(interval);
  }, []);

  return { services, stats };
};
