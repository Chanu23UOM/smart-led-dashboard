import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Target } from 'lucide-react';

const LuxGauge = ({ currentLux, targetLux = 500, totalLux }) => {
  const maxLux = 1000;
  const percentage = Math.min((currentLux / maxLux) * 100, 100);
  const targetPercentage = (targetLux / maxLux) * 100;
  
  // Calculate SVG arc
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75; // 270 degrees
  
  // Determine color based on lux level
  const getColor = () => {
    if (currentLux < 200) return '#ef4444'; // Red - too dark
    if (currentLux < 400) return '#f59e0b'; // Yellow - dim
    if (currentLux < 600) return '#10b981'; // Green - optimal
    return '#06b6d4'; // Cyan - bright
  };

  return (
    <div className="glass-card rounded-2xl p-5 hover-lift h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Sun className="w-5 h-5 text-yellow-400" />
          </div>
          <span className="text-sm text-gray-400">Ambient Light</span>
        </div>
        <span className="text-xs text-gray-500">EN 12464-1</span>
      </div>

      {/* Radial Gauge */}
      <div className="flex justify-center items-center my-2">
        <div className="relative w-44 h-44">
          <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 200 200">
            {/* Background Arc */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#1a1a2e"
              strokeWidth="12"
              strokeDasharray={`${circumference * 0.75} ${circumference}`}
              strokeLinecap="round"
            />
            
            {/* Progress Arc */}
            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={getColor()}
              strokeWidth="12"
              strokeDasharray={`${circumference * 0.75} ${circumference}`}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                filter: `drop-shadow(0 0 8px ${getColor()})`
              }}
            />
            
            {/* Target Marker */}
            <motion.circle
              cx={100 + radius * Math.cos((targetPercentage * 0.75 * 360 / 100 - 135) * Math.PI / 180)}
              cy={100 + radius * Math.sin((targetPercentage * 0.75 * 360 / 100 - 135) * Math.PI / 180)}
              r="6"
              fill="#8b5cf6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                filter: 'drop-shadow(0 0 6px #8b5cf6)'
              }}
            />
          </svg>
          
          {/* Center Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={currentLux}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-white font-cyber"
            >
              {Math.round(currentLux)}
            </motion.span>
            <span className="text-sm text-gray-400">Lux</span>
          </div>
        </div>
      </div>

      {/* Target Indicator */}
      <div className="flex items-center justify-between mt-2 px-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-gray-400">Target: {targetLux} Lux</span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs ${
          Math.abs(totalLux - targetLux) < 50 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {Math.abs(totalLux - targetLux) < 50 ? 'Optimal' : 'Adjusting'}
        </div>
      </div>

      {/* Scale Labels */}
      <div className="flex justify-between mt-2 px-4 text-xs text-gray-500">
        <span>0</span>
        <span>500</span>
        <span>1000</span>
      </div>
    </div>
  );
};

export default LuxGauge;
