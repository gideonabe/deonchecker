
import React from 'react';

interface LoadingSkeletonProps {
  type: 'card' | 'chart' | 'list' | 'metric';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-gray-700/50 animate-pulse">
            <div className="h-4 bg-gray-300/50 dark:bg-gray-600/50 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-300/50 dark:bg-gray-600/50 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300/50 dark:bg-gray-600/50 rounded w-5/6"></div>
          </div>
        );
      case 'chart':
        return (
          <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-gray-700/50 animate-pulse">
            <div className="h-4 bg-gray-300/50 dark:bg-gray-600/50 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-300/50 dark:bg-gray-600/50 rounded"></div>
          </div>
        );
      case 'list':
        return (
          <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-white/20 dark:border-gray-700/50 animate-pulse">
            <div className="flex items-center space-x-4 mb-3">
              <div className="h-10 w-10 bg-gray-300/50 dark:bg-gray-600/50 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300/50 dark:bg-gray-600/50 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300/50 dark:bg-gray-600/50 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        );
      case 'metric':
        return (
          <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-white/20 dark:border-gray-700/50 animate-pulse">
            <div className="h-3 bg-gray-300/50 dark:bg-gray-600/50 rounded w-2/3 mb-2"></div>
            <div className="h-6 bg-gray-300/50 dark:bg-gray-600/50 rounded w-1/2"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

export default LoadingSkeleton;
