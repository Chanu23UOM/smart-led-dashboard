import React from 'react';
import { motion } from 'framer-motion';

const LEDVisualizer = ({ pwm }) => {
  const brightness = pwm / 255;
  const isOn = pwm > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Background Glow Effect */}
      {isOn && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: `radial-gradient(ellipse at center, rgba(254, 240, 138, ${brightness * 0.3}) 0%, transparent 70%)`
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">LED Array Visualization</h3>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isOn ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {isOn ? 'ILLUMINATED' : 'OFF'}
          </div>
        </div>

        {/* LED Grid */}
        <div className="flex justify-center py-6">
          <div className="grid grid-cols-8 gap-3 p-4 bg-gray-900/50 rounded-2xl border border-gray-700/50">
            {[...Array(24)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  backgroundColor: isOn 
                    ? `rgba(254, 240, 138, ${brightness})` 
                    : 'rgba(50, 50, 60, 1)'
                }}
                transition={{ 
                  delay: i * 0.02,
                  duration: 0.3
                }}
                className="w-6 h-6 rounded-full border border-gray-600"
                style={{
                  boxShadow: isOn 
                    ? `0 0 ${10 + brightness * 20}px rgba(254, 240, 138, ${brightness * 0.8}), 
                       0 0 ${5 + brightness * 10}px rgba(254, 240, 138, ${brightness})`
                    : 'inset 0 2px 4px rgba(0,0,0,0.5)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Brightness Indicator */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">Brightness Level</div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${brightness * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #78350f, #fef08a)`,
                    boxShadow: brightness > 0.3 ? '0 0 10px rgba(254, 240, 138, 0.5)' : 'none'
                  }}
                />
              </div>
              <span className="text-sm font-mono text-yellow-400">
                {Math.round(brightness * 100)}%
              </span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            PWM: <span className="font-mono text-white">{pwm}</span>/255
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LEDVisualizer;
