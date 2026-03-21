import React, { useState } from "react";
import { Anchor, Zap, Package, ChevronDown, AlertCircle } from "lucide-react";
import { StatusBadge, LoadingSpinner } from "../Common/index.jsx";

export const EKSCard = ({ cluster }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Safely extract nodes and pods
  let nodes = 1;
  let desired = 1;
  let pods = cluster.pods || cluster.memory || 0;
  
  if (cluster.nodes && typeof cluster.nodes === "string" && cluster.nodes.includes("/")) {
    [nodes, desired] = cluster.nodes.split("/").map(Number);
  } else if (typeof cluster.nodes === "number") {
    nodes = cluster.nodes;
    desired = cluster.nodes;
  }
  
  const nodeHealth = (nodes / desired) * 100;
  const isHealthy = nodes === desired;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start justify-between hover:bg-gray-50"
      >
        <div className="flex items-start gap-3 flex-1">
          <Anchor size={24} className="text-cyan-600 flex-shrink-0 mt-1" />
          <div className="text-left">
            <h3 className="font-bold text-gray-900 text-lg">{cluster.name}</h3>
            <p className="text-xs text-gray-500 mt-1">EKS Cluster1</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={cluster.status || "healthy"} size="sm" />
          <ChevronDown size={20} className={`text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-200 space-y-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-cyan-600" />
                <span className="text-xs font-semibold text-gray-700">Nodes</span>
              </div>
              <p className="text-2xl font-bold text-cyan-600">{nodes}/{desired}</p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Package size={16} className="text-blue-600" />
                <span className="text-xs font-semibold text-gray-700">CPU</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{cluster.cpu || 0}%</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Node Health</span>
              <span className="text-sm font-bold text-cyan-600">{nodeHealth.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3">
              <div
                className={`h-full rounded-full ${isHealthy ? "bg-green-500" : "bg-yellow-500"}`}
                style={{ width: `${nodeHealth}%` }}
              ></div>
            </div>
          </div>

          {!isHealthy && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 flex gap-2">
              <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-yellow-700">{desired - nodes} node(s) offline</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const KubernetesSection = ({ k8sData, loading }) => {
  if (loading) return <LoadingSpinner message="Loading Kubernetes..." />;
  if (!k8sData?.eks || k8sData.eks.length === 0) {
    return <p className="text-center text-gray-500 py-8">No clusters found</p>;
  }

  const totalNodes = k8sData.eks.reduce((sum, c) => {
    if (c.nodes && typeof c.nodes === "string" && c.nodes.includes("/")) {
      return sum + parseInt(c.nodes.split("/")[0]);
    }
    return sum + (typeof c.nodes === "number" ? c.nodes : 0);
  }, 0);
  
  const totalPods = k8sData.eks.reduce((sum, c) => sum + (c.pods || 0), 0);
  const healthyClusters = k8sData.eks.filter(c => c.status?.toLowerCase() === "running" || c.health?.toLowerCase() === "healthy").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
          <p className="text-gray-600 text-sm font-medium">Total Nodes</p>
          <p className="text-3xl font-bold text-cyan-600 mt-2">{totalNodes || k8sData.eks.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-gray-600 text-sm font-medium">Total Pods</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalPods}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-gray-600 text-sm font-medium">Healthy</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{healthyClusters}/{k8sData.eks.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {k8sData.eks.map((cluster, idx) => (
          <EKSCard key={idx} cluster={cluster} />
        ))}
      </div>
    </div>
  );
};
