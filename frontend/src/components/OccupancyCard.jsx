import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX } from 'lucide-react';

const OccupancyCard = ({ count }) => {
  const isOccupied = count > 0;
  
  return (
    <div className="glass-card rounded-2xl p-5 hover-lift h-full">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isOccupied ? 'bg-blue-500/20' : 'bg-gray-500/20'
        }`}>
          <motion.div
            animate={isOccupied ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isOccupied ? (
              <UserCheck className="w-6 h-6 text-blue-400" />
            ) : (
              <UserX className="w-6 h-6 text-gray-400" />
            )}
          </motion.div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isOccupied ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
        }`}>
          {isOccupied ? 'OCCUPIED' : 'EMPTY'}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-400 mb-1">Current Occupancy</p>
        <div className="flex items-baseline gap-2">
          <motion.span
            key={count}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold text-white font-cyber"
          >
            {count}
          </motion.span>
          <span className="text-gray-400 text-lg">Students</span>
        </div>
      </div>

      {/* Occupancy Visualization */}
      <div className="flex items-center gap-1 mt-4">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: i < Math.min(count / 3, 10) ? 1 : 0.2,
              scale: 1
            }}
            transition={{ delay: i * 0.05 }}
            className={`w-full h-2 rounded-full ${
              i < Math.min(count / 3, 10) 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        {count > 20 ? 'High occupancy' : count > 10 ? 'Moderate occupancy' : count > 0 ? 'Low occupancy' : 'No occupants detected'}
      </p>
    </div>
  );
};

export default OccupancyCard;
