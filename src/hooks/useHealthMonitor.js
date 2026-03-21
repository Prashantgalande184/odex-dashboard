// src/hooks/useHealthMonitor.js
import { useState, useEffect } from 'react';

const LAMBDA_URL = 'https://4k2dmu2czrcrwcygjhq4ns5pne0uxjif.lambda-url.ap-south-1.on.aws/';

export const useHealthMonitor = () => {
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({ 
    total: 0, 
    online: 0, 
    offline: 0, 
    uptime: 0,
    ec2: [],
    rds: [],
    eks: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(LAMBDA_URL);
        const data = await response.json();
        const result = JSON.parse(data.body);

        // Set website data
        setServices(result.websites.sites);

        // Set all stats
        setStats({
          total: result.websites.total,
          online: result.websites.online,
          offline: result.websites.offline,
          uptime: result.websites.uptime,
          ec2: result.ec2,
          rds: result.rds,
          eks: result.eks
        });
      } catch (error) {
        console.error('Failed to fetch health data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return { services, stats };
};