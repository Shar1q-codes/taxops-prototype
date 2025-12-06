
import React from 'react';
import { Users, Briefcase, Activity, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { EngagementStatus, Client, Engagement } from '../web/types';

interface Props {
  clients: Client[];
  engagements: Engagement[];
  onNavigate?: (page: 'ENGAGEMENTS') => void;
}

export default function Dashboard({ clients, engagements, onNavigate }: Props) {
  const activeEngagements = engagements.filter(e => e.status === EngagementStatus.IN_PROGRESS).length;
  const highRiskEngagements = engagements.filter(e => e.riskScore > 50).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Firm Dashboard</h1>
        <div className="text-sm text-slate-500">Welcome back, Partner</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Active Clients</h3>
            <Users size={18} className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{clients.length}</div>
          <div className="mt-1 text-xs text-green-600 flex items-center">
            <TrendingUp size={12} className="mr-1" /> +2 this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Active Engagements</h3>
            <Briefcase size={18} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeEngagements}</div>
          <div className="mt-1 text-xs text-slate-500">
            Across {clients.length} clients
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">High Risk Items</h3>
            <Activity size={18} className="text-red-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{highRiskEngagements}</div>
          <div className="mt-1 text-xs text-red-600">
            Requires immediate attention
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Pending Review</h3>
            <Clock size={18} className="text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">5</div>
          <div className="mt-1 text-xs text-slate-500">
            Reports & Workpapers
          </div>
        </div>
      </div>

      {/* Recent Activity / At Risk List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Engagements at Risk</h3>
            <button 
                onClick={() => onNavigate?.('ENGAGEMENTS')}
                className="text-xs text-blue-600 hover:underline"
            >
                View All
            </button>
          </div>
          <div className="p-0">
             <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Client</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Engagement</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {engagements.filter(e => e.riskScore > 0).map(e => (
                    <tr key={e.id}>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {clients.find(c => c.id === e.clientId)?.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 truncate max-w-[150px]">{e.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          e.riskScore > 70 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {e.riskScore}/100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">System Activity</h3>
          </div>
          <div className="p-4 space-y-4">
             <div className="flex gap-3">
               <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                 <Users size={14} />
               </div>
               <div>
                 <p className="text-sm text-slate-900">New client <strong>Soylent Corp</strong> added.</p>
                 <p className="text-xs text-slate-400">2 hours ago • by John Doe</p>
               </div>
             </div>
             <div className="flex gap-3">
               <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                 <Activity size={14} />
               </div>
               <div>
                 <p className="text-sm text-slate-900">Audit rules run for <strong>Acme Corp FY24</strong>.</p>
                 <p className="text-xs text-slate-400">4 hours ago • System</p>
               </div>
             </div>
             <div className="flex gap-3">
               <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                 <AlertTriangle size={14} />
               </div>
               <div>
                 <p className="text-sm text-slate-900">3 High severity findings detected in Payroll.</p>
                 <p className="text-xs text-slate-400">4 hours ago • System</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
