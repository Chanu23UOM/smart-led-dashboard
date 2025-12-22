import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Sliders, 
  ToggleLeft, 
  ToggleRight,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Zap
} from 'lucide-react';
import { SocketContext, SensorDataContext } from '../App';

const ManualControl = () => {
  const socket = useContext(SocketContext);
  const sensorData = useContext(SensorDataContext);
  
  const [manualMode, setManualMode] = useState(false);
  const [pwmValue, setPwmValue] = useState(128);
  const [lastAutoValue, setLastAutoValue] = useState(0);

  useEffect(() => {
    if (sensorData.mode === 'manual') {
      setManualMode(true);
    } else {
      setLastAutoValue(sensorData.ledOutputPWM);
    }
  }, [sensorData]);

  const handleModeToggle = () => {
    const newMode = !manualMode;
    setManualMode(newMode);
    
    if (socket) {
      socket.emit('setManualMode', {
        enabled: newMode,
        pwm: pwmValue
      });
    }
  };

  const handlePWMChange = (value) => {
    setPwmValue(value);
    if (socket && manualMode) {
      socket.emit('setManualPWM', value);
    }
  };

  const brightness = pwmValue / 255;
  const watts = (pwmValue / 255) * 50;

  const presetValues = [
    { label: 'Off', value: 0, icon: '🌑' },
    { label: 'Dim', value: 64, icon: '🌙' },
    { label: 'Medium', value: 128, icon: '☁️' },
    { label: 'Bright', value: 192, icon: '🌤️' },
    { label: 'Max', value: 255, icon: '☀️' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-16"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-cyber font-bold gradient-text">
          MANUAL CONTROL
        </h1>
        <p className="text-gray-400 mt-1">
          Override automatic brightness control
        </p>
      </div>

      {/* Warning Banner when in Manual Mode */}
      {manualMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-4 border border-yellow-500/30 bg-yellow-500/10"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-yellow-400 font-medium">Manual Override Active</p>
              <p className="text-sm text-gray-400">
                Automatic sensor-based control is disabled. Energy optimization is paused.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mode Toggle Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass-card rounded-2xl p-6 ${
          manualMode ? 'border-purple-500/50' : 'border-green-500/30'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Automatic Mode */}
          <div 
            className={`flex-1 p-4 rounded-xl cursor-pointer transition-all ${
              !manualMode 
                ? 'bg-green-500/20 border border-green-500/50' 
                : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800'
            }`}
            onClick={() => manualMode && handleModeToggle()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                !manualMode ? 'bg-green-500/30' : 'bg-gray-700'
              }`}>
                <Cpu className={`w-5 h-5 ${!manualMode ? 'text-green-400' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3 className={`font-bold ${!manualMode ? 'text-green-400' : 'text-gray-400'}`}>
                  Automatic Mode
                </h3>
                <p className="text-xs text-gray-500">Sensor-based control</p>
              </div>
              {!manualMode && (
                <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
              )}
            </div>
            <p className="text-sm text-gray-400">
              System automatically adjusts LED brightness based on occupancy and ambient light sensors.
            </p>
            {!manualMode && (
              <div className="mt-3 pt-3 border-t border-gray-700/50">
                <p className="text-xs text-gray-500">
                  Current auto brightness: <span className="text-green-400 font-mono">{lastAutoValue}</span> PWM
                </p>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <div className="flex justify-center">
            <button
              onClick={handleModeToggle}
              className={`w-20 h-10 rounded-full transition-all duration-300 ${
                manualMode 
                  ? 'bg-purple-500' 
                  : 'bg-gray-700'
              }`}
            >
              <motion.div
                animate={{ x: manualMode ? 40 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-8 h-8 rounded-full bg-white shadow-lg"
              />
            </button>
          </div>

          {/* Manual Mode */}
          <div 
            className={`flex-1 p-4 rounded-xl cursor-pointer transition-all ${
              manualMode 
                ? 'bg-purple-500/20 border border-purple-500/50' 
                : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800'
            }`}
            onClick={() => !manualMode && handleModeToggle()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                manualMode ? 'bg-purple-500/30' : 'bg-gray-700'
              }`}>
                <Sliders className={`w-5 h-5 ${manualMode ? 'text-purple-400' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3 className={`font-bold ${manualMode ? 'text-purple-400' : 'text-gray-400'}`}>
                  Manual Override
                </h3>
                <p className="text-xs text-gray-500">User-controlled</p>
              </div>
              {manualMode && (
                <CheckCircle className="w-5 h-5 text-purple-400 ml-auto" />
              )}
            </div>
            <p className="text-sm text-gray-400">
              Take direct control of LED brightness. Sensors are bypassed during manual operation.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Brightness Control Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`glass-card rounded-2xl p-6 ${!manualMode && 'opacity-50 pointer-events-none'}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            manualMode ? 'bg-yellow-500/20' : 'bg-gray-700'
          }`}>
            <Lightbulb className={`w-6 h-6 ${manualMode ? 'text-yellow-400' : 'text-gray-500'}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Brightness Control</h3>
            <p className="text-sm text-gray-400">Adjust LED output manually</p>
          </div>
        </div>

        {/* PWM Value Display */}
        <div className="text-center mb-8">
          <motion.div
            key={pwmValue}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="inline-block"
          >
            <span className="text-6xl font-bold font-cyber gradient-text">
              {pwmValue}
            </span>
          </motion.div>
          <p className="text-gray-400 mt-2">PWM Value (0-255)</p>
        </div>

        {/* Main Slider */}
        <div className="relative mb-8">
          <div 
            className="absolute inset-0 h-4 rounded-full top-1/2 -translate-y-1/2"
            style={{
              background: `linear-gradient(90deg, 
                #1a1a2e 0%, 
                rgba(234, 179, 8, ${brightness}) ${brightness * 100}%, 
                #1a1a2e ${brightness * 100}%)`
            }}
          />
          <input
            type="range"
            min="0"
            max="255"
            value={pwmValue}
            onChange={(e) => handlePWMChange(parseInt(e.target.value))}
            disabled={!manualMode}
            className="relative z-10 w-full h-4 bg-transparent appearance-none cursor-pointer"
          />
          
          {/* Scale markers */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>0</span>
            <span>64</span>
            <span>128</span>
            <span>192</span>
            <span>255</span>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {presetValues.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePWMChange(preset.value)}
              disabled={!manualMode}
              className={`p-3 rounded-xl transition-all ${
                pwmValue === preset.value
                  ? 'bg-purple-500/30 border border-purple-500/50'
                  : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              <div className="text-2xl mb-1">{preset.icon}</div>
              <div className="text-xs text-gray-400">{preset.label}</div>
              <div className="text-xs font-mono text-gray-500">{preset.value}</div>
            </button>
          ))}
        </div>

        {/* Output Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-700/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {Math.round(brightness * 100)}%
            </p>
            <p className="text-xs text-gray-400">Brightness</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">
              {watts.toFixed(1)}W
            </p>
            <p className="text-xs text-gray-400">Power Draw</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">
              {Math.round((pwmValue / 255) * 500)} Lux
            </p>
            <p className="text-xs text-gray-400">LED Output</p>
          </div>
        </div>
      </motion.div>

      {/* LED Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6 relative overflow-hidden"
      >
        {/* Glow effect */}
        {manualMode && pwmValue > 0 && (
          <motion.div
            className="absolute inset-0"
            animate={{
              background: `radial-gradient(ellipse at center, rgba(254, 240, 138, ${brightness * 0.4}) 0%, transparent 70%)`
            }}
          />
        )}
        
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white mb-4">LED Preview</h3>
          
          <div className="flex justify-center py-8">
            <motion.div
              animate={{
                boxShadow: manualMode && pwmValue > 0
                  ? `0 0 ${20 + brightness * 80}px rgba(254, 240, 138, ${brightness})`
                  : '0 0 5px rgba(100, 100, 100, 0.3)'
              }}
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background: manualMode && pwmValue > 0
                  ? `radial-gradient(circle, rgba(254, 240, 138, ${brightness}) 0%, rgba(251, 191, 36, ${brightness * 0.8}) 50%, rgba(217, 119, 6, ${brightness * 0.6}) 100%)`
                  : 'radial-gradient(circle, #2a2a3e 0%, #1a1a2e 100%)'
              }}
            >
              <Lightbulb 
                className={`w-12 h-12 ${
                  manualMode && pwmValue > 0 ? 'text-yellow-900' : 'text-gray-600'
                }`} 
              />
            </motion.div>
          </div>

          <p className="text-center text-gray-400 text-sm">
            {manualMode 
              ? pwmValue > 0 
                ? `LED output at ${Math.round(brightness * 100)}% brightness`
                : 'LED is OFF'
              : 'Enable manual mode to control LED'
            }
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ManualControl;
