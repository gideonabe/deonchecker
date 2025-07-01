
import React from 'react';
import { DashboardProvider, useDashboard } from '../context/DashboardContext';
import Header from '../components/Header';
import DashboardSelector from '../components/DashboardSelector';
import WeatherDashboard from '../components/weather/WeatherDashboard';
import CryptoDashboard from '../components/crypto/CryptoDashboard';
import GitHubDashboard from '../components/github/GitHubDashboard';

const DashboardContent: React.FC = () => {
  const { activeDashboard } = useDashboard();

  const renderDashboard = () => {
    switch (activeDashboard) {
      case 'weather':
        return <WeatherDashboard />;
      case 'crypto':
        return <CryptoDashboard />;
      case 'github':
        return <GitHubDashboard />;
      default:
        return <WeatherDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <DashboardSelector />
          {renderDashboard()}
        </div>
      </main>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default Index;
