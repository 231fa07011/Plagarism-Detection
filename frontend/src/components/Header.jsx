import React from 'react';
import { Sun, Moon, Bell, User } from 'lucide-react';

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <header className="h-16 border-bottom border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between px-8 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Dashboard Overview</h2>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
          <div className="text-right">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-slate-500">Academic User</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <User className="w-6 h-6 text-primary-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
