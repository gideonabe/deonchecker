import React, { useState, useEffect, useRef } from 'react';
import { Github, Star, GitFork } from 'lucide-react';
import LoadingSkeleton from '../LoadingSkeleton';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const GitHubDashboard: React.FC = () => {
  const [githubData, setGithubData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inputUsername, setInputUsername] = useState('octocat');
  const [username, setUsername] = useState('octocat');
  const timeoutRef = useRef<number | null>(null);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const fetchGitHubData = async (user: string) => {
    setLoading(true);
    try {
      const userRes = await fetch(`https://api.github.com/users/${user}`);
      const userData = await userRes.json();

      const reposRes = await fetch(`https://api.github.com/users/${user}/repos?per_page=100`);
      const repos = await reposRes.json();

      const languageStats: { [key: string]: number } = {};
      repos.forEach((repo: any) => {
        const lang = repo.language;
        if (lang) languageStats[lang] = (languageStats[lang] || 0) + 1;
      });

      setGithubData({
        user: userData,
        repositories: repos,
        languageStats
      });
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce Effect
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (inputUsername.trim() && inputUsername !== username) {
        setUsername(inputUsername.trim());
      }
    }, 600);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [inputUsername]);

  // Fetch GitHub data when username updates
  useEffect(() => {
    fetchGitHubData(username);
  }, [username]);

  // Language chart
  const languageData = githubData
    ? Object.entries(githubData.languageStats).map(([name, value]) => ({ name, value }))
    : [];

  const repoData = githubData?.repositories.slice(0, 7).map((repo: any) => ({
    name: repo.name,
    stars: repo.stargazers_count,
    forks: repo.forks_count
  })) || [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputUsername.trim()) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setUsername(inputUsername.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter GitHub username..."
          className="px-4 py-2 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        <button
          onClick={() => setUsername(inputUsername.trim())}
          className="px-6 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-600 dark:text-purple-400 rounded-lg backdrop-blur-lg border border-purple-500/30 transition-colors"
        >
          Fetch Data
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading || !githubData ? (
        <div className="space-y-6">
          <div className="h-10 w-64 bg-gray-300/50 dark:bg-gray-600/50 rounded-lg animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <LoadingSkeleton type="metric" count={4} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LoadingSkeleton type="chart" count={2} />
          </div>
        </div>
      ) : (
        <>
          {/* User Profile */}
          <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center space-x-4 mb-6">
              <img src={githubData.user.avatar_url} alt={githubData.user.name} className="w-16 h-16 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{githubData.user.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">@{githubData.user.login}</p>
              </div>
              <Github className="w-8 h-8 text-gray-600 dark:text-gray-300 ml-auto" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{githubData.user.public_repos}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Repositories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{githubData.user.followers}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{githubData.user.following}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-gray-700/50">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Language Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-gray-700/50">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Repository Stats</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={repoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      border: '1px solid rgba(75, 85, 99, 0.5)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Bar dataKey="stars" fill="#F59E0B" />
                  <Bar dataKey="forks" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Repo List */}
          <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-gray-700/50">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Repositories</h3>
            <div className="space-y-4">
              {githubData.repositories.slice(0, 5).map((repo: any) => (
                <div key={repo.id} className="p-4 bg-white/5 dark:bg-gray-700/30 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-white">{repo.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{repo.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-500">{repo.language}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{repo.forks_count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GitHubDashboard;
