import { useEffect, useState } from 'react';

const useHealthMonitor = (url) => {
  const [isHealthy, setIsHealthy] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          setIsHealthy(true);
        } else {
          setIsHealthy(false);
        }
      } catch (error) {
        setIsHealthy(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [url]);

  return isHealthy;
};

export default useHealthMonitor;