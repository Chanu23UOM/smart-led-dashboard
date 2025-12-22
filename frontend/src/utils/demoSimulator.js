// Demo mode simulator - generates realistic sensor data when backend is unavailable

class DemoSimulator {
  constructor() {
    this.occupancy = 0;
    this.ambientLux = 300;
    this.mode = 'automatic';
    this.manualPWM = 128;
    this.simulationMode = false;
    this.simulatedSunlight = 300;
    this.simulatedOccupancy = 0;
    this.listeners = [];
    this.interval = null;
  }

  // Calculate LED PWM based on sensor inputs
  calculatePWM() {
    if (this.mode === 'manual') {
      return this.manualPWM;
    }

    const currentOccupancy = this.simulationMode ? this.simulatedOccupancy : this.occupancy;
    const currentLux = this.simulationMode ? this.simulatedSunlight : this.ambientLux;

    if (currentOccupancy === 0) {
      return 0;
    }

    const targetLux = 500;
    const luxDeficit = targetLux - currentLux;

    if (luxDeficit <= 0) {
      return 0;
    }

    const requiredPWM = Math.min(255, Math.max(0, (luxDeficit / 500) * 255));
    return Math.round(requiredPWM);
  }

  // Calculate energy consumption
  calculateEnergy(pwm) {
    const maxWatts = 50;
    return (pwm / 255) * maxWatts;
  }

  // Get current system status
  getStatus() {
    const currentOccupancy = this.simulationMode ? this.simulatedOccupancy : this.occupancy;
    if (currentOccupancy === 0) return 'energy_saving';
    return this.mode === 'automatic' ? 'active' : 'manual';
  }

  // Generate realistic sensor data
  generateReading() {
    const hour = new Date().getHours();
    let baseLux;
    
    if (hour >= 6 && hour < 10) {
      baseLux = 200 + (hour - 6) * 100;
    } else if (hour >= 10 && hour < 16) {
      baseLux = 600 + Math.random() * 200;
    } else if (hour >= 16 && hour < 20) {
      baseLux = 600 - (hour - 16) * 100;
    } else {
      baseLux = 50 + Math.random() * 50;
    }

    if (!this.simulationMode) {
      this.ambientLux = Math.max(0, Math.min(1000, baseLux + (Math.random() - 0.5) * 100));
    }

    let baseOccupancy;
    if (hour >= 8 && hour < 12) {
      baseOccupancy = 15 + Math.floor(Math.random() * 10);
    } else if (hour >= 12 && hour < 14) {
      baseOccupancy = 5 + Math.floor(Math.random() * 5);
    } else if (hour >= 14 && hour < 18) {
      baseOccupancy = 20 + Math.floor(Math.random() * 15);
    } else if (hour >= 18 && hour < 22) {
      baseOccupancy = 10 + Math.floor(Math.random() * 10);
    } else {
      baseOccupancy = Math.floor(Math.random() * 3);
    }

    if (!this.simulationMode) {
      this.occupancy = baseOccupancy;
    }

    const ledPWM = this.calculatePWM();
    const energy = this.calculateEnergy(ledPWM);
    const effectiveOccupancy = this.simulationMode ? this.simulatedOccupancy : this.occupancy;
    const effectiveLux = this.simulationMode ? this.simulatedSunlight : this.ambientLux;

    return {
      timestamp: new Date(),
      occupancyCount: effectiveOccupancy,
      ambientLux: Math.round(effectiveLux),
      ledOutputPWM: ledPWM,
      energyConsumedWatts: parseFloat(energy.toFixed(2)),
      mode: this.mode,
      status: this.getStatus(),
      targetLux: 500,
      totalLux: Math.round(effectiveLux + (ledPWM / 255) * 500),
      simulationMode: this.simulationMode
    };
  }

  // Subscribe to data updates
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Emit data to all listeners
  emit(data) {
    this.listeners.forEach(callback => callback(data));
  }

  // Start simulation
  start() {
    this.emit(this.generateReading());
    this.interval = setInterval(() => {
      this.emit(this.generateReading());
    }, 2000);
  }

  // Stop simulation
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  // Set simulation mode
  setSimulationMode(enabled, sunlight = 300, occupancy = 0) {
    this.simulationMode = enabled;
    this.simulatedSunlight = sunlight;
    this.simulatedOccupancy = occupancy;
    this.emit(this.generateReading());
  }

  // Update simulation values
  updateSimulation(sunlight, occupancy) {
    this.simulatedSunlight = sunlight;
    this.simulatedOccupancy = occupancy;
    this.emit(this.generateReading());
  }

  // Set manual mode
  setManualMode(enabled, pwm = 128) {
    this.mode = enabled ? 'manual' : 'automatic';
    this.manualPWM = pwm;
    this.emit(this.generateReading());
  }

  // Set manual PWM
  setManualPWM(pwm) {
    this.manualPWM = pwm;
    this.emit(this.generateReading());
  }
}

export const demoSimulator = new DemoSimulator();
export default DemoSimulator;
