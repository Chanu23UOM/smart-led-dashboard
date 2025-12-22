import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Leaf, Zap, Settings } from 'lucide-react';

const StatusCard = ({ status, mode }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'energy_saving':
        return {
          icon: Leaf,
          label: 'Energy Saving',
          description: 'No occupants detected',
          color: 'green',
          bgColor: 'bg-green-500/20',
          textColor: 'text-green-400',
          borderColor: 'border-green-500/30',
          glowColor: 'rgba(16, 185, 129, 0.5)'
        };
      case 'active':
        return {
          icon: Zap,
          label: 'Active',
          description: 'Automatic brightness control',
          color: 'blue',
          bgColor: 'bg-blue-500/20',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/30',
          glowColor: 'rgba(59, 130, 246, 0.5)'
        };
      case 'manual':
        return {
          icon: Settings,
          label: 'Manual Override',
          description: 'User controlled brightness',
          color: 'purple',
          bgColor: 'bg-purple-500/20',
          textColor: 'text-purple-400',
          borderColor: 'border-purple-500/30',
          glowColor: 'rgba(139, 92, 246, 0.5)'
        };
      default:
        return {
          icon: Activity,
          label: 'Unknown',
          description: 'Status unavailable',
          color: 'gray',
          bgColor: 'bg-gray-500/20',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500/30',
          glowColor: 'rgba(107, 114, 128, 0.5)'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="glass-card rounded-2xl p-5 hover-lift h-full">
      <div className="flex items-start justify-between mb-4">
        <motion.div 
          className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}
          animate={{
            boxShadow: status === 'energy_saving' 
              ? ['0 0 10px rgba(16, 185, 129, 0.3)', '0 0 20px rgba(16, 185, 129, 0.5)', '0 0 10px rgba(16, 185, 129, 0.3)']
              : status === 'active'
              ? ['0 0 10px rgba(59, 130, 246, 0.3)', '0 0 20px rgba(59, 130, 246, 0.5)', '0 0 10px rgba(59, 130, 246, 0.3)']
              : 'none'
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon className={`w-6 h-6 ${config.textColor}`} />
        </motion.div>
        
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`px-3 py-1 rounded-full ${config.bgColor} ${config.textColor} text-xs font-medium border ${config.borderColor}`}
        >
          {status === 'energy_saving' ? 'ECO' : status === 'active' ? 'AUTO' : 'MANUAL'}
        </motion.div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-1">System Status</p>
        <motion.h3
          key={config.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl font-bold ${config.textColor} font-cyber`}
        >
          {config.label}
        </motion.h3>
        <p className="text-xs text-gray-500 mt-1">{config.description}</p>
      </div>

      {/* Status Indicator Dots */}
      <div className="flex items-center gap-2 mt-4">
        <motion.div
          animate={{
            opacity: status === 'energy_saving' ? [0.5, 1, 0.5] : 0.3,
            scale: status === 'energy_saving' ? [1, 1.2, 1] : 1
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`w-3 h-3 rounded-full ${status === 'energy_saving' ? 'bg-green-500' : 'bg-gray-600'}`}
        />
        <motion.div
          animate={{
            opacity: status === 'active' ? [0.5, 1, 0.5] : 0.3,
            scale: status === 'active' ? [1, 1.2, 1] : 1
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`w-3 h-3 rounded-full ${status === 'active' ? 'bg-blue-500' : 'bg-gray-600'}`}
        />
        <motion.div
          animate={{
            opacity: status === 'manual' ? [0.5, 1, 0.5] : 0.3,
            scale: status === 'manual' ? [1, 1.2, 1] : 1
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`w-3 h-3 rounded-full ${status === 'manual' ? 'bg-purple-500' : 'bg-gray-600'}`}
        />
        <span className="text-xs text-gray-500 ml-2">
          {mode === 'automatic' ? 'Sensor-based control' : 'Manual control'}
        </span>
      </div>
    </div>
  );
};

export default StatusCard;
