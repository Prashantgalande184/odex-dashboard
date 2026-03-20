export const mockAwsData = {
  ec2: [
    { instance_id: 'i-0123456789abcdef0', name: 'web-server-01', status: 'running', cpu: 45, since: '2026-01-15' },
    { instance_id: 'i-0123456789abcdef1', name: 'web-server-02', status: 'running', cpu: 32, since: '2026-01-15' },
    { instance_id: 'i-0123456789abcdef2', name: 'db-server-01', status: 'running', cpu: 78, since: '2026-01-10' },
  ],
  rds: [
    { db_identifier: 'prod-mysql-db', engine: 'mysql', status: 'available', storage: 100, since: '2025-12-01' },
    { db_identifier: 'prod-postgres-db', engine: 'postgres', status: 'available', storage: 250, since: '2025-11-15' },
  ],
  website: {
    url: 'https://odexglobal.com',
    
    status: 'online',
    http_code: 200,
    response_time: 145,
  }
};

export const mockK8sData = {
  eks: [
    { name: 'prod-cluster', health: 'Healthy', nodes: '3/3', pods: 24, last_scale_event: '2026-03-10' },
    { name: 'staging-cluster', health: 'Healthy', nodes: '2/2', pods: 12, last_scale_event: '2026-03-05' },
  ]
};