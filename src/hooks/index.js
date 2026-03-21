import { useState, useCallback, useEffect } from "react";
import { getConnection } from "../connection/ConnectionManager";
import { mockAwsData, mockK8sData } from "../utils/mockData";

export const useInfraData = (refreshInterval = 30000) => {
  const [awsData, setAwsData] = useState({
    ec2: [],
    rds: [],
    website: {}
  });
  
  const [k8sData, setK8sData] = useState({
    eks: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const transformApiData = (rawData) => {
    console.log("?? RAW DATA:", rawData);
    console.log("?? Data Keys:", Object.keys(rawData));
    
    // Get items from response
    let items = [];
    if (Array.isArray(rawData)) {
      items = rawData;
    } else if (rawData && typeof rawData === "object") {
      // Try to extract array from object
      items = rawData.data || rawData.items || rawData.instances || Object.values(rawData).flat().filter(v => typeof v === "object");
    }
    
    console.log("? Extracted items count:", items.length);
    console.log("?? First item:", items[0]);

    if (!Array.isArray(items) || items.length === 0) {
      console.warn("?? No valid items found");
      return null;
    }

    const ec2Instances = items.filter(item => item.instance_id && !item.name?.includes("DB"));
    const databases = items.filter(item => item.name?.includes("DB") || item.name?.includes("database"));
    const k8sServices = items.filter(item => item.name?.includes("ODX-SRV-DEV"));

    console.log("? Categorized:", { ec2: ec2Instances.length, db: databases.length, k8s: k8sServices.length });

    return {
      aws: {
        ec2: ec2Instances.map(item => ({
          id: item.instance_id,
          name: item.name,
          status: item.status,
          cpu: item.cpu || 0,
          memory: item.memory || 0,
          uptime: item.since
        })),
        rds: databases.map(item => ({
          id: item.instance_id,
          name: item.name,
          status: item.status,
          storage: item.storage || 0,
          engine: item.engine || "Unknown"
        })),
        website: {
          name: "Odex Dashboard",
          status: "online",
          health: "Healthy"
        }
      },
      k8s: {
        eks: k8sServices.map(item => ({
          id: item.instance_id,
          name: item.name,
          status: item.status,
          cpu: item.cpu || 0,
          memory: item.memory || 0
        }))
      }
    };
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const connection = getConnection();

      console.log("?? Fetching infrastructure data...");

      const rawData = await connection.callInfraAPI();

      const transformed = transformApiData(rawData);

      if (!transformed) {
        throw new Error("Failed to transform API data");
      }

      setAwsData(transformed.aws);
      setK8sData(transformed.k8s);
      setLastUpdated(new Date());
      setIsUsingMockData(false);

      console.log("? Dashboard updated with real data");

    } catch (err) {
      console.warn("?? API Error:", err.message);
      setError(err.message);
      setIsUsingMockData(true);
      setAwsData(mockAwsData);
      setK8sData(mockK8sData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { awsData, k8sData, loading, error, lastUpdated, refetch: fetchData, isUsingMockData };
};
