const API_URL = "https://l25wiszwb5.execute-api.ap-south-1.amazonaws.com/prod/infra";

export const fetchInfrastructureData = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return transformData(data);
  } catch (error) {
    console.error("Failed to fetch infrastructure data:", error);
    return null;
  }
};

const transformData = (rawData) => {
  if (!Array.isArray(rawData)) return null;

  const kubernetesServices = rawData.filter(item => item.name?.includes("ODX-SRV-DEV"));
  const awsServices = rawData.filter(item => item.name?.includes("DB") || item.name?.includes("API"));
  
  return {
    kubernetes: {
      totalNodes: kubernetesServices.length,
      totalPods: kubernetesServices.length,
      healthy: kubernetesServices.filter(s => s.status === "running").length,
      services: kubernetesServices.slice(0, 2).map(s => ({
        name: s.name,
        status: s.status,
        cpu: s.cpu || 0,
        memory: s.memory || 0
      }))
    },
    aws: {
      ec2Instances: rawData.filter(i => i.instance_id).length,
      databases: rawData.filter(i => i.name?.includes("DB")).length,
      running: rawData.filter(i => i.status === "running").length,
      services: rawData.slice(0, 12).map(s => ({
        name: s.name,
        status: s.status,
        cpu: s.cpu || 0,
        storage: s.storage || 0
      }))
    },
    metrics: {
      totalEcu: rawData.reduce((sum, s) => sum + (s.cpu || 0), 0).toFixed(1),
      running: rawData.filter(s => s.status === "running").length,
      highCpu: rawData.filter(s => (s.cpu || 0) > 10).length,
      sdsAvailable: rawData.filter(s => s.storage).length
    }
  };
};

