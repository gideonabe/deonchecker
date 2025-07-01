
import React from 'react';
import { Cloud, TrendingUp, Github } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { DashboardType } from '../types/dashboard';

const DashboardSelector: React.FC = () => {
  const { activeDashboard, setActiveDashboard } = useDashboard();

  const dashboards = [
    {
      type: 'weather' as DashboardType,
      title: 'Weather',
      description: 'Real-time weather data and forecasts',
      icon: Cloud,
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      type: 'crypto' as DashboardType,
      title: 'Crypto Market',
      description: 'Cryptocurrency prices and market data',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-400'
    },
    {
      type: 'github' as DashboardType,
      title: 'GitHub Stats',
      description: 'Repository statistics and analytics',
      icon: Github,
      gradient: 'from-purple-500 to-pink-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {dashboards.map((dashboard) => {
        const Icon = dashboard.icon;
        const isActive = activeDashboard === dashboard.type;
        
        return (
          <button
            key={dashboard.type}
            onClick={() => setActiveDashboard(dashboard.type)}
            className={`group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 ${
              isActive
                ? 'bg-white/20 dark:bg-gray-800/60 border-2 border-white/30 dark:border-gray-600/50'
                : 'bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/50 hover:bg-white/15 dark:hover:bg-gray-800/40'
            } backdrop-blur-lg`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${dashboard.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            <div className="relative z-10">
              <Icon className={`w-8 h-8 mb-4 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300'} group-hover:text-white transition-colors`} />
              <h3 className={`text-lg font-semibold mb-2 ${isActive ? 'text-white' : 'text-gray-800 dark:text-gray-200'} group-hover:text-white transition-colors`}>
                {dashboard.title}
              </h3>
              <p className={`text-sm ${isActive ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'} group-hover:text-gray-200 transition-colors`}>
                {dashboard.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default DashboardSelector;
