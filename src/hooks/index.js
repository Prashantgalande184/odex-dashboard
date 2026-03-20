import { useState, useCallback, useEffect } from 'react';
import { getConnection } from '../connection/ConnectionManager';
import { mockAwsData, mockK8sData } from '../utils/mockData';

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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const connection = getConnection();

      console.log('🔄 Fetching infrastructure data...');

      // Call your API - it returns data directly
      const apiData = await connection.callInfraAPI();
      
      console.log('✅ Full API Response:', apiData);

      // Your API returns:
      // { ec2: [], rds: [], eks: [], website: {} }
      // We need to structure it for our app
      
      const awsStructured = {
        ec2: apiData.ec2 || [],
        rds: apiData.rds || [],
        website: apiData.website || {}
      };

      const k8sStructured = {
        eks: apiData.eks || []
      };

      setAwsData(awsStructured);
      setK8sData(k8sStructured);
      setLastUpdated(new Date());
      setIsUsingMockData(false);
      
      console.log('✅ Data successfully loaded from API');
      console.log('EC2 Instances:', awsStructured.ec2.length);
      console.log('RDS Databases:', awsStructured.rds.length);
      console.log('EKS Clusters:', k8sStructured.eks.length);

    } catch (err) {
      console.warn('⚠️ API Error:', err.message);
      console.log('📊 Using mock data as fallback');
      
      setError(err.message);
      setIsUsingMockData(true);
      
      // Fallback to mock data
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