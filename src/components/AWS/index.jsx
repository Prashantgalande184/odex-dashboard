import React, { useState, useMemo } from 'react';
import { Server, Database, Globe, AlertCircle } from 'lucide-react';
import { SearchBar, TabNavigation, LoadingSpinner } from '../Common/index.jsx';
import { EC2List } from './EC2/index.jsx';
import { RDSList } from './RDS/index.jsx';
import { WebsiteList } from './Websites/index.jsx';

export const AWSInfraSection = ({ awsData, loading }) => {
  const [activeTab, setActiveTab] = useState('ec2');
  const [searchTerm, setSearchTerm] = useState('');

  const filterResources = (resources) => {
    if (!searchTerm || !resources) return resources;
    return resources.filter(r => Object.values(r).join(' ').toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const ec2List = useMemo(() => filterResources(awsData?.ec2 || []), [awsData?.ec2, searchTerm]);
  const rdsList = useMemo(() => filterResources(awsData?.rds || []), [awsData?.rds, searchTerm]);
  const websiteList = useMemo(() => awsData?.website ? [awsData.website] : [], [awsData?.website]);

  const tabs = [
    { id: 'ec2', label: 'EC2 Instances', icon: Server, count: ec2List?.length || 0 },
    { id: 'rds', label: 'RDS Databases', icon: Database, count: rdsList?.length || 0 },
    { id: 'websites', label: 'Websites', icon: Globe, count: websiteList?.length || 0 },
  ];

  if (loading) return <LoadingSpinner message="Loading AWS..." />;
  if (!awsData) return <p className="text-gray-500 py-8 text-center">No data</p>;

  // Calculate metrics
  const runningEC2 = ec2List?.filter(i => i.status?.toLowerCase() === 'running').length || 0;
  const highCPUEC2 = ec2List?.filter(i => i.cpu > 70).length || 0;
  const availableRDS = rdsList?.filter(r => r.status?.toLowerCase() === 'available').length || 0;

  return (
    <div className="space-y-6">
      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search EC2, RDS, websites..." />
      <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div>
        {activeTab === 'ec2' && <EC2List instances={ec2List} />}
        {activeTab === 'rds' && <RDSList databases={rdsList} />}
        {activeTab === 'websites' && <WebsiteList websites={websiteList} />}
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-gray-600 text-sm font-medium">Total EC2</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{ec2List?.length || 0}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-gray-600 text-sm font-medium">Running</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{runningEC2}</p>
        </div>

        <div className={`rounded-lg p-4 border ${highCPUEC2 > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
          <p className="text-gray-600 text-sm font-medium flex items-center gap-2">
            {highCPUEC2 > 0 && <AlertCircle size={16} className="text-yellow-600" />}
            High CPU
          </p>
          <p className={`text-3xl font-bold mt-2 ${highCPUEC2 > 0 ? 'text-yellow-600' : 'text-gray-600'}`}>{highCPUEC2}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-gray-600 text-sm font-medium">RDS Available</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{availableRDS}</p>
        </div>
      </div>
    </div>
  );
};