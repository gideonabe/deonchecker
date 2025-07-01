
import React from 'react';
import { Sun, CloudSun } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const Header: React.FC = () => {
  const { isDarkMode, setIsDarkMode } = useDashboard();

  return (
    <header className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">DeonChecker</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Modern Analytics Dashboard</p>
        </div>
        
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-800/70 transition-all duration-300"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <CloudSun className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
