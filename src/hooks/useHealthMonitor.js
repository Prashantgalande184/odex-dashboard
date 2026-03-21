import { useState, useEffect } from 'react';

export const useHealthMonitor = () => {
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0, uptime: 0 });

  useEffect(() => {
    const checkServices = async () => {
      const MONITORING_URLS = [
        { name: 'in.odex.global', url: 'https://in.odexglobal.com/' },
        { name: 'QC Auth', url: 'https://qctest.odexglobal.com/auth' },
        { name: 'QC API', url: 'https://qctest.odexglobal.com/api' },
        { name: 'QC OPC', url: 'https://qctest.odexglobal.com/opc' },
        { name: 'QC Zipkin', url: 'https://qctest.odexglobal.com/zipkin' },
        { name: 'QC Kibana', url: 'https://qctest.odexglobal.com/kibana' },
        { name: 'QC MFT', url: 'https://qctest.odexglobal.com/mft' },
        { name: 'QC CPP', url: 'https://qctest.odexglobal.com/cpp' },
        { name: 'QC HL', url: 'https://qctest.odexglobal.com/hl' },
        { name: 'QC Main', url: 'https://qctest.odexglobal.com' },
        { name: 'QC Kafka UI', url: 'https://qckafkaui.odexglobal.com' },
        { name: 'QC Grafana', url: 'https://qcgrafana.odexglobal.com' },
        { name: 'QC Payments', url: 'https://qc-payments.odexglobal.com' },
        { name: 'QC Payments ALT', url: 'https://www.qctest.odexglobal.com' },
        { name: 'TPDCS OPC Auth', url: 'https://qctest.tpdcs.com/opc-auth' },
        { name: 'TPDCS API', url: 'https://qctest.tpdcs.com/api' },
        { name: 'TPDCS Main', url: 'https://qctest.tpdcs.com' },
        { name: 'TPDCS ALT', url: 'https://www.qctest.tpdcs.com' },
        { name: 'QC Test 2786', url: 'https://qctest2786.odexglobal.com/api' },
        { name: 'QC Payment Svc', url: 'https://qctest-payment.odexglobal.com/api' },
      ];

      const results = await Promise.all(
        MONITORING_URLS.map(async (service) => {
          try {
            const start = Date.now();
            const response = await fetch(service.url, {
              method: 'HEAD',
              cache: 'no-store',
            });
            const responseTime = Date.now() - start;
            const statusCode = response.status;
            const isOnline = statusCode >= 200 && statusCode < 300;
            
            return { ...service, isOnline, responseTime, statusCode };
          } catch (error) {
            return { ...service, isOnline: false, responseTime: null, statusCode: 'ERROR' };
          }
        })
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
