import React from 'react';
import { Anchor, Server } from 'lucide-react';
import { useInfraData } from '../../hooks/index.js';
import { ErrorAlert, LoadingSpinner } from '../Common/index.jsx';
import { Header } from '../Layout/Header.jsx';
import { Footer } from '../Layout/Footer.jsx';
import { AWSInfraSection } from '../AWS/index.jsx';
import { KubernetesSection } from '../Kubernetes/index.jsx';

export const Dashboard = () => {
  const { awsData, k8sData, loading, error, lastUpdated, refetch, isUsingMockData } = useInfraData(30000);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onRefresh={refetch} loading={loading} isUsingMockData={isUsingMockData} lastUpdated={lastUpdated} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && <ErrorAlert error={error} onClose={() => {}} />}

        <section className="bg-white rounded-lg p-6 border border-gray-200 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Anchor size={28} className="text-cyan-600" />
            <h2 className="text-2xl font-bold text-gray-900">Kubernetes Monitoring</h2>
          </div>
          <KubernetesSection k8sData={k8sData} loading={loading} />
        </section>

        <section className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Server size={28} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">AWS Infrastructure</h2>
          </div>
          <AWSInfraSection awsData={awsData} loading={loading} />
        </section>
      </main>

      <Footer lastUpdated={lastUpdated} />
    </div>
  );
};