import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import LoadingSkeleton from '../LoadingSkeleton';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  sparkline_in_7d: { price: number[] };
}

const CryptoDashboard: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputTerm, setInputTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const debounceRef = useRef<number | null>(null);

  const fetchCryptoList = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true&order=market_cap_desc&per_page=10&page=1`
      );
      const data: Crypto[] = await res.json();
      setCryptoData(data);
      setSelectedCrypto(data[0] || null);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCryptoList();
  }, []);

  // Debounce input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      if (inputTerm.trim() !== searchTerm.trim()) {
        setSearchTerm(inputTerm.trim());
      }
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputTerm]);

  const handleSearch = () => {
    if (inputTerm.trim() !== searchTerm.trim()) {
      setSearchTerm(inputTerm.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      handleSearch();
    }
  };

  const filtered = cryptoData.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = selectedCrypto?.sparkline_in_7d.price.map((price, i) => ({
    day: `Day ${i + 1}`,
    price
  })) || [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-gray-300/50 dark:bg-gray-600/50 rounded-lg animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LoadingSkeleton type="list" count={3} />
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
          value={inputTerm}
          onChange={e => setInputTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search cryptocurrencies..."
          className="px-4 py-2 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-600 dark:text-green-400 rounded-lg backdrop-blur-lg border border-green-500/30 transition-colors"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCrypto(c)}
            className={`p-4 rounded-xl text-left transition-all duration-300 ${
              selectedCrypto?.id === c.id
                ? 'bg-white/20 dark:bg-gray-800/60 border-2 border-white/30 dark:border-gray-600/50'
                : 'bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/50 hover:bg-white/15 dark:hover:bg-gray-800/40'
            } backdrop-blur-lg`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <img src={c.image} alt={c.name} className="w-8 h-8 rounded-full" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{c.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{c.symbol.toUpperCase()}</p>
                </div>
              </div>
              <div className={`flex items-center ${c.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {c.price_change_percentage_24h >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {Math.abs(c.price_change_percentage_24h).toFixed(2)}%
              </div>
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              ${c.current_price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Volume: ${(c.total_volume / 1e9).toFixed(2)}B
            </p>
          </button>
        ))}
      </div>

      {selectedCrypto && (
        <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <img src={selectedCrypto.image} alt={selectedCrypto.name} className="w-10 h-10 rounded-full" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedCrypto.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedCrypto.symbol.toUpperCase()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                ${selectedCrypto.current_price.toLocaleString()}
              </p>
              <p className={`text-lg font-semibold ${selectedCrypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {selectedCrypto.price_change_percentage_24h >= 0 ? '+' : ''}{selectedCrypto.price_change_percentage_24h.toFixed(2)}%
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#374151" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={selectedCrypto.price_change_percentage_24h >= 0 ? "#10B981" : "#EF4444"}
                strokeWidth={3}
                dot={{ fill: selectedCrypto.price_change_percentage_24h >= 0 ? "#10B981" : "#EF4444", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CryptoDashboard;
