
// Renders the firm overview dashboard by consuming pre-fetched firm entities.
import React from 'react';
import Link from 'next/link';
import { Users, Briefcase, Activity, TrendingUp, Clock, AlertTriangle, ArrowRight, LucideIcon } from 'lucide-react';
import { EngagementStatus } from '../../../types';
import { useFirmEntities } from '../../../hooks/useFirmEntities';

interface Props {
  onNavigate?: (path: string) => void;
}

interface KPICardProps {
  title: string;
  value: number;
  trend: string;
  icon: LucideIcon;
  color: 'blue' | 'indigo' | 'red' | 'amber';
  href: string;
  ariaLabel: string;
  onNavigate?: (path: string) => void;
}

export default function DashboardPage({ onNavigate }: Props) {
  const { clients, engagements, loading, error } = useFirmEntities();

  if (loading) {
    return <div className="p-8 flex justify-center"><span className="loader">Loading dashboard...</span></div>;
  }

  if (error) {
    return <div className="p-8 text-sm text-red-600">{error}</div>;
  }

  const activeEngagements = engagements.filter(e => e.status === EngagementStatus.IN_PROGRESS).length;
  const highRiskEngagements = engagements.filter(e => e.riskScore > 50).length;

  const metricCards: KPICardProps[] = [
    {
      title: 'Active Clients',
      value: clients.length,
      trend: '+2 this month',
      icon: Users,
      color: 'blue',
      href: '/app/clients',
      ariaLabel: 'Navigate to active clients',
      onNavigate,
    },
    {
      title: 'Active Engagements',
      value: activeEngagements,
      trend: `Across ${clients.length} clients`,
      icon: Briefcase,
      color: 'indigo',
      href: '/app/engagements',
      ariaLabel: 'Navigate to active engagements',
      onNavigate,
    },
    {
      title: 'High Risk Items',
      value: highRiskEngagements,
      trend: 'Requires attention',
      icon: Activity,
      color: 'red',
      href: '/app/engagements?filter=high-risk',
      ariaLabel: 'Navigate to high risk engagements',
      onNavigate,
    },
    {
      title: 'Pending Review',
      value: 5,
      trend: 'Reports & Workpapers',
      icon: Clock,
      color: 'amber',
      href: '/app/engagements?filter=pending-review',
      ariaLabel: 'Navigate to engagements pending review',
      onNavigate,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Firm Overview</h1>
        <p className="text-slate-500 mt-1">Real-time engagement tracking and risk analysis.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => (
          <KPICard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* At Risk Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              Engagements at Risk
            </h3>
            <button 
                onClick={() => onNavigate?.('engagements')}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1"
            >
                View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="p-0 overflow-x-auto">
             <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 text-left">Client</th>
                    <th className="px-5 py-3 text-left">Engagement</th>
                    <th className="px-5 py-3 text-left">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {engagements.filter(e => e.riskScore > 0).slice(0, 5).map(e => (
                    <tr 
                      key={e.id} 
                      onClick={() => onNavigate?.(`engagements/${e.id}/overview`)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3 text-sm font-medium text-slate-900">
                        {e.clientName}
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-500">{e.name}</td>
                      <td className="px-5 py-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          e.riskScore > 70 ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
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

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
          </div>
          <div className="p-5 space-y-6">
             <ActivityItem 
               icon={Users} color="blue" 
               title="New client added" 
               desc="Soylent Corp added by John Doe" 
               time="2 hours ago" 
             />
             <ActivityItem 
               icon={Activity} color="green" 
               title="Audit rules execution" 
               desc="Completed for Acme Corp FY24" 
               time="4 hours ago" 
             />
             <ActivityItem 
               icon={AlertTriangle} color="amber" 
               title="Risk detected" 
               desc="3 High severity findings in Payroll" 
               time="4 hours ago" 
             />
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, icon: Icon, color, href, ariaLabel, onNavigate }: KPICardProps) {
    const colors: Record<KPICardProps['color'], string> = {
        blue: 'text-blue-600 bg-blue-100 group-hover:bg-blue-200 group-focus-visible:bg-blue-200 group-hover:text-blue-700 group-focus-visible:text-blue-700',
        indigo: 'text-indigo-600 bg-indigo-100 group-hover:bg-indigo-200 group-focus-visible:bg-indigo-200 group-hover:text-indigo-700 group-focus-visible:text-indigo-700',
        red: 'text-red-600 bg-red-100 group-hover:bg-red-200 group-focus-visible:bg-red-200 group-hover:text-red-700 group-focus-visible:text-red-700',
        amber: 'text-amber-600 bg-amber-100 group-hover:bg-amber-200 group-focus-visible:bg-amber-200 group-hover:text-amber-700 group-focus-visible:text-amber-700',
    };

    const handleNavigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!onNavigate) return;
      event.preventDefault();
      const normalizedPath = href.replace(/^\/app\//, '').replace(/^\//, '').split('?')[0];
      onNavigate(normalizedPath);
    };

    return (
        <Link
          href={href}
          onClick={handleNavigate}
          role="button"
          aria-label={ariaLabel}
          className="group block h-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 transform-gpu hover:-translate-y-0.5 hover:shadow-md hover:scale-[1.01] focus-visible:-translate-y-0.5 focus-visible:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">{title}</h3>
            <div className={`p-2 rounded-lg transition-colors ${colors[color]}`}>
                <Icon size={18} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{value}</div>
          <div className="mt-2 text-xs font-medium text-slate-500 flex items-center">
             {title === 'Active Clients' && <TrendingUp size={12} className="mr-1 text-green-600" />} 
             {trend}
          </div>
        </Link>
    );
}

function ActivityItem({ icon: Icon, color, title, desc, time }: { icon: LucideIcon; color: 'blue' | 'green' | 'amber'; title: string; desc: string; time: string; }) {
    const bgColors: Record<'blue' | 'green' | 'amber', string> = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', amber: 'bg-amber-100 text-amber-600' };
    return (
        <div className="flex gap-4">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${bgColors[color]}`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{title}</p>
                <p className="text-sm text-slate-500">{desc}</p>
                <p className="text-xs text-slate-400 mt-1">{time}</p>
            </div>
        </div>
    );
}
