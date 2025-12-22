import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Sun, 
  Lightbulb, 
  TrendingDown, 
  Activity,
  Gauge,
  Zap,
  Battery,
  Eye,
  Sliders
} from 'lucide-react';
import { SocketContext, SensorDataContext } from '../App';
import OccupancyCard from '../components/OccupancyCard';
import LuxGauge from '../components/LuxGauge';
import StatusCard from '../components/StatusCard';
import EnergySavingsCard from '../components/EnergySavingsCard';
import SimulationPanel from '../components/SimulationPanel';
import LEDVisualizer from '../components/LEDVisualizer';

const Dashboard = () => {
  const socket = useContext(SocketContext);
  const sensorData = useContext(SensorDataContext);
  const [simulationMode, setSimulationMode] = useState(false);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-16"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <motion.h1 
            className="text-3xl font-cyber font-bold gradient-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            LIVE DASHBOARD
          </motion.h1>
          <motion.p 
            className="text-gray-400 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Real-time monitoring of the Smart LED System
          </motion.p>
        </div>
        
        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-4 py-2 glass-card rounded-full"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-green-500"
          />
          <span className="text-sm text-green-400 font-medium">System Active</span>
        </motion.div>
      </div>

      {/* LED Visualizer */}
      <LEDVisualizer pwm={sensorData.ledOutputPWM} />

      {/* Main Metrics Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Occupancy Card */}
        <motion.div variants={cardVariants}>
          <OccupancyCard count={sensorData.occupancyCount} />
        </motion.div>

        {/* Ambient Light Card */}
        <motion.div variants={cardVariants}>
          <LuxGauge 
            currentLux={sensorData.ambientLux} 
            targetLux={sensorData.targetLux}
            totalLux={sensorData.totalLux}
          />
        </motion.div>

        {/* System Status Card */}
        <motion.div variants={cardVariants}>
          <StatusCard status={sensorData.status} mode={sensorData.mode} />
        </motion.div>

        {/* Energy Savings Card */}
        <motion.div variants={cardVariants}>
          <EnergySavingsCard 
            currentWatts={sensorData.energyConsumedWatts}
            pwm={sensorData.ledOutputPWM}
          />
        </motion.div>
      </motion.div>

      {/* Secondary Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* PWM Output */}
        <div className="glass-card rounded-2xl p-5 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">LED Output</p>
                <p className="text-2xl font-bold text-white">{sensorData.ledOutputPWM}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">PWM</span>
          </div>
          
          {/* PWM Progress Bar */}
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(sensorData.ledOutputPWM / 255) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
              style={{
                boxShadow: sensorData.ledOutputPWM > 0 
                  ? '0 0 10px rgba(234, 179, 8, 0.5)' 
                  : 'none'
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {((sensorData.ledOutputPWM / 255) * 100).toFixed(0)}% Brightness
          </p>
        </div>

        {/* Total Lux */}
        <div className="glass-card rounded-2xl p-5 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Illuminance</p>
                <p className="text-2xl font-bold text-white">{sensorData.totalLux}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">Lux</span>
          </div>
          
          {/* Target Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              Math.abs(sensorData.totalLux - 500) < 50 
                ? 'bg-green-500' 
                : 'bg-yellow-500'
            }`} />
            <span className="text-xs text-gray-400">
              {Math.abs(sensorData.totalLux - 500) < 50 
                ? 'Optimal for studying' 
                : `${sensorData.totalLux < 500 ? 'Below' : 'Above'} target (500 Lux)`
              }
            </span>
          </div>
        </div>

        {/* Power Consumption */}
        <div className="glass-card rounded-2xl p-5 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Power Draw</p>
                <p className="text-2xl font-bold text-white">
                  {sensorData.energyConsumedWatts.toFixed(1)}
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-500">Watts</span>
          </div>
          
          {/* Efficiency Indicator */}
          <div className="flex items-center gap-2">
            <Battery className={`w-4 h-4 ${
              sensorData.energyConsumedWatts < 20 
                ? 'text-green-500' 
                : 'text-yellow-500'
            }`} />
            <span className="text-xs text-gray-400">
              {sensorData.energyConsumedWatts < 20 
                ? 'High Efficiency Mode' 
                : 'Normal Operation'
              }
            </span>
          </div>
        </div>
      </motion.div>

      {/* Simulation Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <SimulationPanel 
          simulationMode={simulationMode}
          setSimulationMode={setSimulationMode}
        />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
