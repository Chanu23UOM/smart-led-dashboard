import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  Info, 
  Zap,
  Wifi,
  WifiOff,
  Menu,
  X,
  Monitor
} from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import ManualControl from './pages/ManualControl';
import About from './pages/About';

// Demo Simulator for GitHub Pages
import { demoSimulator } from './utils/demoSimulator';

// Create Socket Context
export const SocketContext = createContext(null);
export const SensorDataContext = createContext(null);
export const DemoModeContext = createContext(false);

function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [sensorData, setSensorData] = useState({
    timestamp: new Date(),
    occupancyCount: 0,
    ambientLux: 300,
    ledOutputPWM: 0,
    energyConsumedWatts: 0,
    mode: 'automatic',
    status: 'energy_saving',
    targetLux: 500,
    totalLux: 300,
    simulationMode: false
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize Socket Connection or Demo Mode
  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    const newSocket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnectionAttempts: 3
    });

    let connectionTimeout = setTimeout(() => {
      // If not connected after 5 seconds, switch to demo mode
      if (!isConnected) {
        console.log('Backend not available, switching to Demo Mode');
        setIsDemoMode(true);
        newSocket.close();
        
        // Start demo simulator
        demoSimulator.subscribe((data) => {
          setSensorData(data);
        });
        demoSimulator.start();
      }
    }, 5000);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      clearTimeout(connectionTimeout);
      setIsConnected(true);
      setIsDemoMode(false);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', () => {
      console.log('Connection error, switching to Demo Mode');
      clearTimeout(connectionTimeout);
      setIsDemoMode(true);
      newSocket.close();
      
      demoSimulator.subscribe((data) => {
        setSensorData(data);
      });
      demoSimulator.start();
    });

    newSocket.on('sensorData', (data) => {
      setSensorData(data);
    });

    setSocket(newSocket);

    return () => {
      clearTimeout(connectionTimeout);
      newSocket.close();
      demoSimulator.stop();
    };
  }, []);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/control', icon: Settings, label: 'Control' },
    { path: '/about', icon: Info, label: 'About' }
  ];

  // Create a wrapper for socket/demo functionality
  const socketOrDemo = isDemoMode ? {
    emit: (event, data) => {
      if (event === 'setSimulationMode') {
        demoSimulator.setSimulationMode(data.enabled, data.sunlight, data.occupancy);
      } else if (event === 'updateSimulation') {
        demoSimulator.updateSimulation(data.sunlight, data.occupancy);
      } else if (event === 'setManualMode') {
        demoSimulator.setManualMode(data.enabled, data.pwm);
      } else if (event === 'setManualPWM') {
        demoSimulator.setManualPWM(data);
      }
    }
  } : socket;

  return (
    <SocketContext.Provider value={socketOrDemo}>
      <SensorDataContext.Provider value={sensorData}>
        <DemoModeContext.Provider value={isDemoMode}>
        <Router>
          <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
            {/* Animated Background */}
            <div className="cyber-bg" />
            
            {/* Floating Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  x: [0, -100, 0],
                  y: [0, 100, 0],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
              />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-purple-500/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  {/* Logo */}
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="relative">
                      <motion.div
                        animate={{
                          boxShadow: sensorData.ledOutputPWM > 0 
                            ? [
                                '0 0 10px #fef08a',
                                '0 0 30px #fef08a',
                                '0 0 10px #fef08a'
                              ]
                            : '0 0 5px rgba(139, 92, 246, 0.5)'
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center"
                      >
                        <Zap className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>
                    <div className="hidden sm:block">
                      <h1 className="font-cyber text-lg font-bold gradient-text">
                        SMART LED
                      </h1>
                      <p className="text-xs text-gray-400">University of Moratuwa</p>
                    </div>
                  </motion.div>

                  {/* Desktop Navigation */}
                  <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `nav-link flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            isActive
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`
                        }
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </NavLink>
                    ))}
                  </div>

                  {/* Connection Status */}
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                        isConnected ? 'bg-green-500/20' : isDemoMode ? 'bg-purple-500/20' : 'bg-red-500/20'
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Wifi className="w-4 h-4 text-green-400" />
                          </motion.div>
                          <span className="text-xs text-green-400 hidden sm:inline">Live</span>
                        </>
                      ) : isDemoMode ? (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Monitor className="w-4 h-4 text-purple-400" />
                          </motion.div>
                          <span className="text-xs text-purple-400 hidden sm:inline">Demo</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-4 h-4 text-red-400" />
                          <span className="text-xs text-red-400 hidden sm:inline">Offline</span>
                        </>
                      )}
                    </motion.div>

                    {/* Mobile Menu Button */}
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="md:hidden p-2 rounded-lg hover:bg-white/10"
                    >
                      {mobileMenuOpen ? (
                        <X className="w-6 h-6" />
                      ) : (
                        <Menu className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Menu */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden border-t border-purple-500/20"
                  >
                    <div className="px-4 py-4 space-y-2">
                      {navItems.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                              isActive
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`
                          }
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </nav>

            {/* Main Content */}
            <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/control" element={<ManualControl />} />
                    <Route path="/about" element={<About />} />
                  </Routes>
                </AnimatePresence>
              </div>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 py-3 glass border-t border-purple-500/20 z-40">
              <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  © 2024 Smart LED Research Project
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>ESD Project</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">University of Moratuwa</span>
                </div>
              </div>
            </footer>
          </div>
        </Router>
        </DemoModeContext.Provider>
      </SensorDataContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;
