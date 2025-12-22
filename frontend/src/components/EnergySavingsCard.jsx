import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Battery, Leaf, DollarSign } from 'lucide-react';

const EnergySavingsCard = ({ currentWatts, pwm }) => {
  const [animatedSavings, setAnimatedSavings] = useState(0);
  
  // Calculate static system consumption (always at max)
  const maxWatts = 50;
  const staticConsumption = maxWatts;
  const smartConsumption = currentWatts;
  
  // Calculate savings percentage
  const savingsPercent = staticConsumption > 0 
    ? ((staticConsumption - smartConsumption) / staticConsumption) * 100
    : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedSavings(savingsPercent);
    }, 100);
    return () => clearTimeout(timer);
  }, [savingsPercent]);

  // Calculate energy saved in a day (assuming continuous operation)
  const hourlySmartKWh = (smartConsumption / 1000);
  const hourlyStaticKWh = (staticConsumption / 1000);
  const dailySavingsKWh = (hourlyStaticKWh - hourlySmartKWh) * 24;

  return (
    <div className="glass-card rounded-2xl p-5 hover-lift h-full relative overflow-hidden">
      {/* Background Glow Effect */}
      {savingsPercent > 40 && (
        <motion.div
          className="absolute inset-0 bg-green-500/5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <motion.div
              animate={{ rotate: savingsPercent > 40 ? [0, 10, -10, 0] : 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Leaf className="w-6 h-6 text-green-400" />
            </motion.div>
          </div>
          
          <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
            <TrendingDown className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400 font-medium">Saving</span>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-400 mb-1">Energy Savings</p>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={Math.round(animatedSavings)}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-4xl font-bold font-cyber ${
                animatedSavings >= 40 ? 'text-green-400' : 
                animatedSavings >= 20 ? 'text-yellow-400' : 'text-gray-400'
              }`}
            >
              {Math.round(animatedSavings)}%
            </motion.span>
          </div>
          <p className="text-xs text-gray-500 mt-1">vs. Static System</p>
        </div>

        {/* Comparison Bar */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Static System</span>
            <span className="text-red-400">{staticConsumption}W</span>
          </div>
          <div className="h-2 bg-red-500/30 rounded-full" />
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Smart System</span>
            <span className="text-green-400">{smartConsumption.toFixed(1)}W</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(smartConsumption / staticConsumption) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
            />
          </div>
        </div>

        {/* Daily Savings Estimate */}
        <div className="mt-4 pt-3 border-t border-gray-700/50">
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400">
              Est. daily savings: <span className="text-cyan-400 font-medium">{dailySavingsKWh.toFixed(2)} kWh</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergySavingsCard;
