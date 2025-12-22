import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  Legend,
  Cell
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Zap,
  Users,
  Sun,
  RefreshCw
} from 'lucide-react';

const Analytics = () => {
  const [energyData, setEnergyData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [stabilityData, setStabilityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('24h');

  // Generate sample data for demonstration
  useEffect(() => {
    generateSampleData();
  }, [selectedPeriod]);

  const generateSampleData = () => {
    setLoading(true);

    // Generate 24-hour energy comparison data
    const energy = [];
    for (let hour = 0; hour < 24; hour++) {
      const staticConsumption = 50; // Static system always at max
      
      // Smart system varies based on time of day
      let smartConsumption;
      if (hour >= 6 && hour < 10) {
        smartConsumption = 15 + Math.random() * 15;
      } else if (hour >= 10 && hour < 16) {
        smartConsumption = 5 + Math.random() * 10; // Low during sunny hours
      } else if (hour >= 16 && hour < 22) {
        smartConsumption = 25 + Math.random() * 15;
      } else {
        smartConsumption = Math.random() * 5; // Night - minimal
      }

      energy.push({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        static: staticConsumption,
        smart: parseFloat(smartConsumption.toFixed(1)),
        savings: parseFloat((staticConsumption - smartConsumption).toFixed(1))
      });
    }
    setEnergyData(energy);

    // Generate heatmap data (day of week x hour)
    const heatmap = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        let occupancy;
        
        // Weekend patterns
        if (day === 0 || day === 6) {
          if (hour >= 10 && hour < 18) {
            occupancy = 5 + Math.random() * 10;
          } else {
            occupancy = Math.random() * 3;
          }
        } else {
          // Weekday patterns
          if (hour >= 8 && hour < 12) {
            occupancy = 15 + Math.random() * 15;
          } else if (hour >= 12 && hour < 14) {
            occupancy = 5 + Math.random() * 8;
          } else if (hour >= 14 && hour < 18) {
            occupancy = 20 + Math.random() * 15;
          } else if (hour >= 18 && hour < 22) {
            occupancy = 10 + Math.random() * 10;
          } else {
            occupancy = Math.random() * 3;
          }
        }

        heatmap.push({
          day: days[day],
          dayIndex: day,
          hour,
          hourLabel: `${hour.toString().padStart(2, '0')}:00`,
          occupancy: Math.round(occupancy)
        });
      }
    }
    setHeatmapData(heatmap);

    // Generate light stability scatter plot data
    const stability = [];
    for (let i = 0; i < 100; i++) {
      const ambientLux = 100 + Math.random() * 700;
      const targetLux = 500;
      const luxDeficit = Math.max(0, targetLux - ambientLux);
      const ledContribution = (luxDeficit / 500) * 500;
      const totalLux = ambientLux + ledContribution + (Math.random() - 0.5) * 30; // Small variation

      stability.push({
        ambientLux: Math.round(ambientLux),
        totalLux: Math.round(totalLux),
        ledContribution: Math.round(ledContribution),
        variance: Math.abs(totalLux - targetLux)
      });
    }
    setStabilityData(stability);

    setTimeout(() => setLoading(false), 500);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-lg p-3 border border-purple-500/30">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.name.includes('Consumption') ? 'W' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getOccupancyColor = (value) => {
    if (value < 5) return 'rgba(16, 185, 129, 0.3)';
    if (value < 15) return 'rgba(16, 185, 129, 0.5)';
    if (value < 25) return 'rgba(234, 179, 8, 0.6)';
    return 'rgba(239, 68, 68, 0.7)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-16"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-cyber font-bold gradient-text">
            ANALYTICS
          </h1>
          <p className="text-gray-400 mt-1">
            Energy consumption and occupancy analysis
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center gap-1 p-1 bg-gray-800/50 rounded-lg">
            {['24h', '7d', '30d'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-purple-500/30 text-purple-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            onClick={generateSampleData}
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Energy Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Energy Consumption Comparison</h3>
            <p className="text-sm text-gray-400">Static vs Smart System (24-hour period)</p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={energyData}>
              <defs>
                <linearGradient id="staticGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="smartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4e" />
              <XAxis 
                dataKey="hour" 
                stroke="#666" 
                tick={{ fill: '#888', fontSize: 12 }}
                interval={2}
              />
              <YAxis 
                stroke="#666" 
                tick={{ fill: '#888', fontSize: 12 }}
                unit="W"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="static"
                name="Static System"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#staticGradient)"
              />
              <Area
                type="monotone"
                dataKey="smart"
                name="Smart System"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#smartGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700/50">
          <div className="text-center">
            <p className="text-3xl font-bold text-red-400">
              {energyData.reduce((acc, d) => acc + d.static, 0)} Wh
            </p>
            <p className="text-sm text-gray-400">Static System (24h)</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">
              {energyData.reduce((acc, d) => acc + d.smart, 0).toFixed(0)} Wh
            </p>
            <p className="text-sm text-gray-400">Smart System (24h)</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">
              {((1 - energyData.reduce((acc, d) => acc + d.smart, 0) / energyData.reduce((acc, d) => acc + d.static, 0)) * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-400">Energy Saved</p>
          </div>
        </div>
      </motion.div>

      {/* Occupancy Heatmap */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Occupancy Heatmap</h3>
            <p className="text-sm text-gray-400">Study area usage patterns by day and hour</p>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Hour labels */}
            <div className="flex mb-2 ml-12">
              {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
                <div key={hour} className="flex-1 text-center text-xs text-gray-500">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {/* Heatmap rows */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
              <div key={day} className="flex items-center mb-1">
                <div className="w-12 text-xs text-gray-400">{day}</div>
                <div className="flex flex-1 gap-0.5">
                  {[...Array(24)].map((_, hour) => {
                    const data = heatmapData.find(
                      d => d.day === day && d.hour === hour
                    );
                    const occupancy = data?.occupancy || 0;
                    
                    return (
                      <motion.div
                        key={hour}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: (dayIndex * 24 + hour) * 0.002 }}
                        className="flex-1 h-8 rounded-sm cursor-pointer hover:ring-1 hover:ring-white/50 transition-all"
                        style={{ backgroundColor: getOccupancyColor(occupancy) }}
                        title={`${day} ${hour.toString().padStart(2, '0')}:00 - ${occupancy} students`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }} />
                <span className="text-xs text-gray-400">Low (&lt;5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(16, 185, 129, 0.5)' }} />
                <span className="text-xs text-gray-400">Medium (5-15)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(234, 179, 8, 0.6)' }} />
                <span className="text-xs text-gray-400">High (15-25)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.7)' }} />
                <span className="text-xs text-gray-400">Peak (&gt;25)</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Light Stability Scatter Plot */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Sun className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Light Stability Analysis</h3>
            <p className="text-sm text-gray-400">Total illuminance maintained at 500 Lux despite varying ambient light</p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4e" />
              <XAxis
                type="number"
                dataKey="ambientLux"
                name="Ambient Light"
                unit=" Lux"
                stroke="#666"
                tick={{ fill: '#888', fontSize: 12 }}
                domain={[0, 800]}
                label={{ value: 'Ambient Light (Lux)', position: 'bottom', fill: '#888', offset: -5 }}
              />
              <YAxis
                type="number"
                dataKey="totalLux"
                name="Total Light"
                unit=" Lux"
                stroke="#666"
                tick={{ fill: '#888', fontSize: 12 }}
                domain={[400, 600]}
                label={{ value: 'Total Illuminance (Lux)', angle: -90, position: 'insideLeft', fill: '#888' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-card rounded-lg p-3 border border-cyan-500/30">
                        <p className="text-cyan-400">Ambient: {data.ambientLux} Lux</p>
                        <p className="text-yellow-400">LED: +{data.ledContribution} Lux</p>
                        <p className="text-white font-bold">Total: {data.totalLux} Lux</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Target Line */}
              <Line
                type="monotone"
                dataKey={() => 500}
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Target (500 Lux)"
              />
              <Scatter
                data={stabilityData}
                fill="#06b6d4"
              >
                {stabilityData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.variance < 20 ? '#10b981' : entry.variance < 40 ? '#f59e0b' : '#ef4444'}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Stability Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700/50">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">
              {stabilityData.filter(d => d.variance < 20).length}%
            </p>
            <p className="text-sm text-gray-400">Excellent Stability</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-cyan-400">
              500 Lux
            </p>
            <p className="text-sm text-gray-400">Target Setpoint</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">
              ±{Math.round(stabilityData.reduce((acc, d) => acc + d.variance, 0) / stabilityData.length)} Lux
            </p>
            <p className="text-sm text-gray-400">Avg. Variance</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
