import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Sun, Users, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react';
import { SocketContext, SensorDataContext } from '../App';

const SimulationPanel = ({ simulationMode, setSimulationMode }) => {
  const socket = useContext(SocketContext);
  const sensorData = useContext(SensorDataContext);
  
  const [sunlight, setSunlight] = useState(300);
  const [occupancy, setOccupancy] = useState(0);

  const handleSimulationToggle = () => {
    const newMode = !simulationMode;
    setSimulationMode(newMode);
    
    if (socket) {
      socket.emit('setSimulationMode', {
        enabled: newMode,
        sunlight: sunlight,
        occupancy: occupancy
      });
    }
  };

  const handleSunlightChange = (value) => {
    setSunlight(value);
    if (socket && simulationMode) {
      socket.emit('updateSimulation', {
        sunlight: value,
        occupancy: occupancy
      });
    }
  };

  const handleOccupancyChange = (value) => {
    setOccupancy(value);
    if (socket && simulationMode) {
      socket.emit('updateSimulation', {
        sunlight: sunlight,
        occupancy: value
      });
    }
  };

  const resetSimulation = () => {
    setSunlight(300);
    setOccupancy(0);
    if (socket) {
      socket.emit('updateSimulation', {
        sunlight: 300,
        occupancy: 0
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-2xl p-6 ${
        simulationMode ? 'border-purple-500/50 neon-purple' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            simulationMode ? 'bg-purple-500/30' : 'bg-gray-500/20'
          }`}>
            <Sliders className={`w-6 h-6 ${
              simulationMode ? 'text-purple-400' : 'text-gray-400'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Simulation Mode</h3>
            <p className="text-sm text-gray-400">
              {simulationMode ? 'Manually control inputs' : 'Enable to simulate sensor data'}
            </p>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={handleSimulationToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            simulationMode 
              ? 'bg-purple-500/30 text-purple-400 border border-purple-500/50' 
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30'
          }`}
        >
          {simulationMode ? (
            <>
              <ToggleRight className="w-5 h-5" />
              <span className="font-medium">ON</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-5 h-5" />
              <span className="font-medium">OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Simulation Controls */}
      <motion.div
        animate={{
          opacity: simulationMode ? 1 : 0.5,
          height: 'auto'
        }}
        className={`space-y-6 ${!simulationMode && 'pointer-events-none'}`}
      >
        {/* Sunlight Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className={`w-5 h-5 ${simulationMode ? 'text-yellow-400' : 'text-gray-500'}`} />
              <span className="text-sm text-gray-300">Simulate Sunlight</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold font-mono ${
                simulationMode ? 'text-yellow-400' : 'text-gray-500'
              }`}>
                {sunlight}
              </span>
              <span className="text-xs text-gray-500">Lux</span>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1000"
              value={sunlight}
              onChange={(e) => handleSunlightChange(parseInt(e.target.value))}
              disabled={!simulationMode}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: simulationMode 
                  ? `linear-gradient(to right, #1a1a2e ${0}%, #f59e0b ${sunlight / 10}%, #1a1a2e ${sunlight / 10}%)`
                  : '#1a1a2e'
              }}
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Dark (0)</span>
              <span>Cloudy (300)</span>
              <span>Sunny (700)</span>
              <span>Bright (1000)</span>
            </div>
          </div>

          {/* Sun visualization */}
          <div className="flex justify-center">
            <motion.div
              animate={{
                scale: simulationMode ? 0.5 + (sunlight / 1000) * 0.5 : 0.5,
                opacity: simulationMode ? 0.3 + (sunlight / 1000) * 0.7 : 0.3
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500"
              style={{
                boxShadow: simulationMode && sunlight > 200 
                  ? `0 0 ${sunlight / 10}px rgba(251, 191, 36, 0.5)` 
                  : 'none'
              }}
            />
          </div>
        </div>

        {/* Occupancy Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className={`w-5 h-5 ${simulationMode ? 'text-blue-400' : 'text-gray-500'}`} />
              <span className="text-sm text-gray-300">Simulate Occupancy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold font-mono ${
                simulationMode ? 'text-blue-400' : 'text-gray-500'
              }`}>
                {occupancy}
              </span>
              <span className="text-xs text-gray-500">Students</span>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="0"
              max="50"
              value={occupancy}
              onChange={(e) => handleOccupancyChange(parseInt(e.target.value))}
              disabled={!simulationMode}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: simulationMode 
                  ? `linear-gradient(to right, #1a1a2e ${0}%, #3b82f6 ${occupancy * 2}%, #1a1a2e ${occupancy * 2}%)`
                  : '#1a1a2e'
              }}
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Empty</span>
              <span>Low (10)</span>
              <span>Medium (25)</span>
              <span>Full (50)</span>
            </div>
          </div>

          {/* People visualization */}
          <div className="flex justify-center gap-1 flex-wrap max-w-xs mx-auto">
            {[...Array(Math.min(occupancy, 20))].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="w-3 h-3 rounded-full bg-blue-500"
              />
            ))}
            {occupancy > 20 && (
              <span className="text-xs text-blue-400 ml-2">+{occupancy - 20} more</span>
            )}
          </div>
        </div>

        {/* Reset Button */}
        {simulationMode && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={resetSimulation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl text-gray-300 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Simulation</span>
          </motion.button>
        )}
      </motion.div>

      {/* Info Text */}
      {!simulationMode && (
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-500 text-center">
            Enable simulation mode to manually control sunlight and occupancy inputs. 
            Watch how the system responds in real-time!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SimulationPanel;
