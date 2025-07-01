
import React, { createContext, useContext, ReactNode } from 'react';
import { DashboardType } from '../types/dashboard';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface DashboardContextType {
  activeDashboard: DashboardType;
  setActiveDashboard: (dashboard: DashboardType) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeDashboard, setActiveDashboard] = useLocalStorage<DashboardType>('activeDashboard', 'weather');
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('darkMode', true);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <DashboardContext.Provider value={{
      activeDashboard,
      setActiveDashboard,
      isDarkMode,
      setIsDarkMode
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
