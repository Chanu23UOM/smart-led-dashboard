// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Lighting standards
export const EN_12464_1 = {
  STUDY_AREA_LUX: 500,      // Target illuminance for study areas
  MAX_UGR: 19,              // Maximum Unified Glare Rating
  MIN_CRI: 80,              // Minimum Color Rendering Index
};

// System constants
export const SYSTEM_CONFIG = {
  MAX_PWM: 255,
  MAX_LUX: 1000,
  MAX_LED_OUTPUT_LUX: 500,  // Max lux contribution from LED at PWM 255
  MAX_POWER_WATTS: 50,      // Maximum power consumption at full brightness
  MAX_OCCUPANCY: 50,
  SENSOR_UPDATE_INTERVAL: 2000, // ms
};

// Helper functions
export const calculatePWM = (occupancy, ambientLux, targetLux = EN_12464_1.STUDY_AREA_LUX) => {
  if (occupancy === 0) return 0;
  
  const luxDeficit = targetLux - ambientLux;
  if (luxDeficit <= 0) return 0;
  
  const requiredPWM = (luxDeficit / SYSTEM_CONFIG.MAX_LED_OUTPUT_LUX) * SYSTEM_CONFIG.MAX_PWM;
  return Math.min(SYSTEM_CONFIG.MAX_PWM, Math.max(0, Math.round(requiredPWM)));
};

export const calculatePowerConsumption = (pwm) => {
  return (pwm / SYSTEM_CONFIG.MAX_PWM) * SYSTEM_CONFIG.MAX_POWER_WATTS;
};

export const calculateLEDContribution = (pwm) => {
  return (pwm / SYSTEM_CONFIG.MAX_PWM) * SYSTEM_CONFIG.MAX_LED_OUTPUT_LUX;
};

export const calculateEnergySavings = (smartWatts, staticWatts = SYSTEM_CONFIG.MAX_POWER_WATTS) => {
  if (staticWatts === 0) return 0;
  return ((staticWatts - smartWatts) / staticWatts) * 100;
};

// Format utilities
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Status helpers
export const getSystemStatus = (occupancy, mode) => {
  if (occupancy === 0) return 'energy_saving';
  return mode === 'automatic' ? 'active' : 'manual';
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'energy_saving': return 'green';
    case 'active': return 'blue';
    case 'manual': return 'purple';
    default: return 'gray';
  }
};

// Lux level descriptions
export const getLuxDescription = (lux) => {
  if (lux < 100) return 'Very Dark';
  if (lux < 300) return 'Dim';
  if (lux < 500) return 'Moderate';
  if (lux < 750) return 'Bright';
  return 'Very Bright';
};

// Occupancy descriptions
export const getOccupancyDescription = (count) => {
  if (count === 0) return 'Empty';
  if (count < 5) return 'Very Low';
  if (count < 15) return 'Low';
  if (count < 25) return 'Moderate';
  if (count < 40) return 'High';
  return 'Very High';
};
