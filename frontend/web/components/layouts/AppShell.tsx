
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  ShieldCheck, 
  LogOut,
  Menu,
  Search,
  ChevronRight
} from 'lucide-react';
import { CURRENT_USER } from '../../lib/constants';
import { useSettings } from '../../hooks/useSettings';
import NotificationBell from '../notifications/notification-bell';

interface AppShellProps {
  children: React.ReactNode;
  activePath?: string;
  onNavigate: (path: string) => void;
  breadcrumbs?: { label: string; path?: string }[];
}

export default function AppShell({ children, activePath = 'dashboard', onNavigate, breadcrumbs = [] }: AppShellProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { settings } = useSettings();

  const userName = settings?.user.fullName || CURRENT_USER.name;
  const userRole = settings?.user.role || CURRENT_USER.role;
  const firmName = settings?.firm.firmName || 'Corallo AI';

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const NavItem = ({ id, icon: Icon, label, path }: any) => (
    <button
      onClick={() => onNavigate(path)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
        activePath.startsWith(id)
          ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static flex-shrink-0`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-200 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xl">
            <ShieldCheck className="h-8 w-8" />
            <span>{firmName}</span>
          </div>
        </div>

        <div className="flex flex-col h-[calc(100%-4rem)] justify-between">
          <div className="p-4 space-y-6">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">
                Firm Operations
              </div>
              <nav className="space-y-1">
                <NavItem id="dashboard" path="dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem id="clients" path="clients" icon={Users} label="Clients" />
                <NavItem id="engagements" path="engagements" icon={Briefcase} label="Engagements" />
                <NavItem id="settings" path="settings" icon={Settings} label="Settings" />
              </nav>
            </div>
          </div>

          <div className="border-t border-slate-200 p-4 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                {userName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{userName}</p>
                <p className="text-xs text-slate-500 truncate">{userRole}</p>
              </div>
              <button onClick={() => onNavigate('logout')} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors">
                   <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md"
            >
              <Menu size={20} />
            </button>
            
            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center text-sm font-medium text-slate-500">
              <span 
                className="hover:text-slate-900 cursor-pointer"
                onClick={() => onNavigate('dashboard')}
              >
                  Home
              </span>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight size={16} className="mx-2 text-slate-400" />
                  <span 
                    className={crumb.path ? "hover:text-slate-900 cursor-pointer" : "text-slate-900 font-semibold"}
                    onClick={() => crumb.path && onNavigate(crumb.path)}
                  >
                    {crumb.label}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
            <NotificationBell onNavigate={onNavigate} />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8 relative">
           <div className="max-w-7xl mx-auto h-full">
            {children}
           </div>
        </div>
      </main>
    </div>
  );
}
