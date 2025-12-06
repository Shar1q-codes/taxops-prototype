
import React from 'react';
import { Engagement, Finding, WorkpaperTask } from '../web/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, CheckCircle2, TrendingUp, FileText } from 'lucide-react';

interface Props {
  engagement: Engagement;
  findings: Finding[];
  tasks: WorkpaperTask[];
}

export default function EngagementOverview({ engagement, findings, tasks }: Props) {
  // Aggregate stats dynamically
  const totalFindings = findings.length;
  const highRisk = findings.filter(f => f.severity === 'HIGH').length;
  const mediumRisk = findings.filter(f => f.severity === 'MEDIUM').length;
  const lowRisk = findings.filter(f => f.severity === 'LOW').length;
  const openFindings = findings.filter(f => f.status === 'OPEN' || f.status === 'IN_PROGRESS').length;
  
  // Calculate Progress based on tasks completed
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Dynamic Risk Score (Simple heuristic)
  const calculatedRiskScore = Math.min(100, (highRisk * 20) + (mediumRisk * 10) + (lowRisk * 2));

  const pieData = [
    { name: 'High Risk', value: highRisk, color: '#ef4444' },
    { name: 'Medium Risk', value: mediumRisk, color: '#f59e0b' },
    { name: 'Low Risk', value: lowRisk, color: '#3b82f6' },
  ];

  // Filter out zero values for cleaner chart
  const activePieData = pieData.filter(d => d.value > 0);
  const showChart = activePieData.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Risk Score</div>
          <div className="text-3xl font-bold text-slate-900">{calculatedRiskScore}</div>
          <div className={`text-xs font-medium mt-1 ${calculatedRiskScore > 50 ? 'text-red-600' : 'text-blue-600'}`}>
            {calculatedRiskScore > 75 ? 'Critical Risk Level' : calculatedRiskScore > 40 ? 'High Risk Level' : 'Moderate Risk Level'}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
           <div className="text-sm text-slate-500 mb-1">Total Findings</div>
           <div className="text-3xl font-bold text-slate-900">{totalFindings}</div>
           <div className="text-xs text-slate-500 mt-1">{openFindings} Open / {findings.length - openFindings} Resolved</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
           <div className="text-sm text-slate-500 mb-1">Audit Progress</div>
           <div className="text-3xl font-bold text-slate-900">{progressPercent}%</div>
           <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
             <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
           </div>
           <div className="text-xs text-slate-500 mt-1">{completedTasks} of {totalTasks} tasks done</div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
           <div className="text-sm text-slate-500 mb-1">Materiality</div>
           <div className="text-3xl font-bold text-slate-900">$125k</div>
           <div className="text-xs text-slate-500 mt-1">Performance: $90k</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col min-w-0">
          <h3 className="font-semibold text-slate-900 mb-4">Risk Distribution</h3>
          <div className="flex-1 min-h-[250px] flex items-center justify-center relative min-w-0">
            {showChart ? (
                <>
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={activePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {activePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-2xl font-bold text-slate-900">{totalFindings}</div>
                    <div className="text-xs text-slate-500">Issues</div>
                </div>
                </>
            ) : (
                <div className="text-slate-400 text-sm flex flex-col items-center">
                    <CheckCircle2 size={32} className="mb-2 opacity-50" />
                    No findings detected yet.
                </div>
            )}
          </div>
          <div className="flex justify-center gap-6 mt-4">
             {pieData.map(d => (
                <div key={d.name} className={`flex items-center gap-2 text-xs ${d.value === 0 ? 'opacity-40' : ''}`}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span className="text-slate-600">{d.name} ({d.value})</span>
                </div>
             ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Priority Action Items</h3>
            </div>
            <div className="divide-y divide-slate-100">
                {findings.filter(f => f.severity === 'HIGH' && f.status !== 'RESOLVED').length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2 opacity-50" />
                        No high priority findings. Good job!
                    </div>
                )}
                {findings.filter(f => f.severity === 'HIGH' && f.status !== 'RESOLVED').slice(0, 4).map(f => (
                    <div key={f.id} className="p-4 flex gap-3 items-start hover:bg-slate-50 transition-colors">
                         <AlertTriangle className="text-red-500 h-5 w-5 mt-0.5 flex-shrink-0" />
                         <div>
                             <div className="text-sm font-medium text-slate-900">{f.code}</div>
                             <div className="text-xs text-slate-500 mt-1 line-clamp-2">{f.message}</div>
                             {f.amount && <div className="text-xs font-mono text-slate-600 mt-1">${f.amount.toLocaleString()}</div>}
                         </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
