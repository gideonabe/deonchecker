import React, { useState, useEffect } from 'react';
import {
  Cloud, CloudRain, CloudSnow, CloudSun, Sun
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import LoadingSkeleton from '../LoadingSkeleton';

const WeatherDashboard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('san francisco');
  const [hasSearched, setHasSearched] = useState(false);


  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const fetchWeatherData = async (selectedCity: string) => {
    setLoading(true);
    try {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&APPID=${apiKey}&units=metric`
      );
      const current = await currentRes.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&APPID=${apiKey}&units=metric`
      );
      const forecastRaw = await forecastRes.json();

      const forecastMap = new Map();
      forecastRaw.list.forEach((item: any) => {
        const date = item.dt_txt.split(' ')[0];
        if (!forecastMap.has(date)) forecastMap.set(date, []);
        forecastMap.get(date).push(item);
      });

      const processedForecast = Array.from(forecastMap.entries()).slice(0, 7).map(([date, items]) => {
        const temps = items.map((i: any) => i.main.temp);
        const weather = items[0].weather[0];
        return {
          dt: new Date(date).getTime(),
          temp: {
            day: Math.max(...temps),
            night: Math.min(...temps),
            min: Math.min(...temps),
            max: Math.max(...temps),
          },
          weather: [{
            main: weather.main,
            description: weather.description,
            icon: weather.icon,
          }],
        };
      });

      setWeatherData({
        current: {
          temp: current.main.temp,
          feels_like: current.main.feels_like,
          humidity: current.main.humidity,
          wind_speed: current.wind.speed,
          weather: current.weather,
        },
        location: {
          name: current.name,
          country: current.sys.country,
          timezone: current.timezone,
        },
        forecast: processedForecast,
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // === Debounced fetch on input ===
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasSearched && city.length >= 3) {
        fetchWeatherData(city);
      }
    }, 2000);
  
    return () => clearTimeout(timeout);
  }, [city, hasSearched]);
  

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear': return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'clouds': return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'snow': return <CloudSnow className="w-8 h-8 text-blue-200" />;
      default: return <CloudSun className="w-8 h-8 text-orange-400" />;
    }
  };

  const chartData = weatherData?.forecast.slice(0, 5).map((day: any) => ({
    name: new Date(day.dt).toLocaleDateString('en', { weekday: 'short' }),
    temp: Math.round(day.temp.day),
    min: Math.round(day.temp.min),
    max: Math.round(day.temp.max)
  })) || [];

  if (loading || !weatherData) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-gray-300/50 dark:bg-gray-600/50 rounded-lg animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <LoadingSkeleton type="card" count={4} />
        </div>
        <LoadingSkeleton type="chart" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setHasSearched(false); // reset search status if typing again
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && city.length >= 3) {
              fetchWeatherData(city);
              setHasSearched(true);
            }
          }}
          placeholder="Enter city..."
          className="px-4 py-2 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        <button
          onClick={() => fetchWeatherData(city)}
          className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 rounded-lg backdrop-blur-lg border border-blue-500/30 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* === Current Weather === */}
      <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {weatherData.location.name}, {weatherData.location.country}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 capitalize">
              {weatherData.current.weather[0].description}
            </p>
          </div>
          {getWeatherIcon(weatherData.current.weather[0].main)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{Math.round(weatherData.current.temp)}°C</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800 dark:text-white">{Math.round(weatherData.current.feels_like)}°C</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Feels like</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800 dark:text-white">{weatherData.current.humidity}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800 dark:text-white">{weatherData.current.wind_speed} m/s</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</p>
          </div>
        </div>
      </div>

      {/* === Forecast Chart === */}
      <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-gray-700/50">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">5-Day Forecast</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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
            <Line type="monotone" dataKey="temp" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }} />
            <Line type="monotone" dataKey="max" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="min" stroke="#06B6D4" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* === Forecast Cards === */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {weatherData.forecast.map((day: any, index: number) => (
          <div key={index} className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-white/20 dark:border-gray-700/50 text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              {new Date(day.dt).toLocaleDateString('en', { weekday: 'short' })}
            </p>
            <div className="flex justify-center mb-2">
              {getWeatherIcon(day.weather[0].main)}
            </div>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{Math.round(day.temp.day)}°</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {Math.round(day.temp.min)}° / {Math.round(day.temp.max)}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDashboard;
