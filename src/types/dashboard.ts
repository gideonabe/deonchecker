
export type DashboardType = 'weather' | 'crypto' | 'github';

export interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  };
  location: {
    name: string;
    country: string;
    timezone: number;
  };
  forecast: Array<{
    dt: number;
    temp: {
      day: number;
      night: number;
      min: number;
      max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  sparkline_in_7d: {
    price: number[];
  };
}

export interface GitHubData {
  user: {
    login: string;
    name: string;
    avatar_url: string;
    public_repos: number;
    followers: number;
    following: number;
  };
  repositories: Array<{
    id: number;
    name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    updated_at: string;
  }>;
  languageStats: Record<string, number>;
}
