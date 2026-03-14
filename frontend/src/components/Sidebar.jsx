import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, History, LogOut, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Templates', icon: Layout, path: '/templates' },
    { name: 'My Scans', icon: History, path: '/history' },
    { name: 'Documents', icon: FileText, path: '/documents' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="w-64 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-primary-500" />
        <span className="text-xl font-bold tracking-tight">DetectPro</span>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
