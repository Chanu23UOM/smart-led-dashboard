require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const SensorLog = require('./models/SensorLog');

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_led_system');
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Don't exit - allow app to run with simulated data
    console.log('⚠️ Running with simulated data only (no database)');
  }
};

// Simulated Sensor Data Generator
class SensorSimulator {
  constructor() {
    this.occupancy = 0;
    this.ambientLux = 300;
    this.mode = 'automatic';
    this.manualPWM = 128;
    this.simulationMode = false;
    this.simulatedSunlight = 300;
    this.simulatedOccupancy = 0;
  }

  // Calculate LED PWM based on sensor inputs
  calculatePWM() {
    if (this.mode === 'manual') {
      return this.manualPWM;
    }

    const currentOccupancy = this.simulationMode ? this.simulatedOccupancy : this.occupancy;
    const currentLux = this.simulationMode ? this.simulatedSunlight : this.ambientLux;

    // If no one is present, turn off lights (energy saving)
    if (currentOccupancy === 0) {
      return 0;
    }

    // Target is 500 lux (EN 12464-1 standard for study areas)
    const targetLux = 500;
    const luxDeficit = targetLux - currentLux;

    if (luxDeficit <= 0) {
      return 0; // Enough ambient light
    }

    // Calculate required PWM (assuming max LED output adds 500 lux at PWM 255)
    const requiredPWM = Math.min(255, Math.max(0, (luxDeficit / 500) * 255));
    return Math.round(requiredPWM);
  }

  // Calculate energy consumption (assuming 50W max LED power)
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
    // Time-based ambient light simulation (simulates daylight cycle)
    const hour = new Date().getHours();
    let baseLux;
    
    if (hour >= 6 && hour < 10) {
      baseLux = 200 + (hour - 6) * 100; // Morning: increasing
    } else if (hour >= 10 && hour < 16) {
      baseLux = 600 + Math.random() * 200; // Midday: peak
    } else if (hour >= 16 && hour < 20) {
      baseLux = 600 - (hour - 16) * 100; // Afternoon: decreasing
    } else {
      baseLux = 50 + Math.random() * 50; // Night: low
    }

    // Add some noise
    if (!this.simulationMode) {
      this.ambientLux = Math.max(0, Math.min(1000, baseLux + (Math.random() - 0.5) * 100));
    }

    // Time-based occupancy simulation (study area patterns)
    let baseOccupancy;
    if (hour >= 8 && hour < 12) {
      baseOccupancy = 15 + Math.floor(Math.random() * 10); // Morning classes
    } else if (hour >= 12 && hour < 14) {
      baseOccupancy = 5 + Math.floor(Math.random() * 5); // Lunch break
    } else if (hour >= 14 && hour < 18) {
      baseOccupancy = 20 + Math.floor(Math.random() * 15); // Afternoon peak
    } else if (hour >= 18 && hour < 22) {
      baseOccupancy = 10 + Math.floor(Math.random() * 10); // Evening study
    } else {
      baseOccupancy = Math.floor(Math.random() * 3); // Night: minimal
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

  // Set manual mode and PWM
  setManualMode(enabled, pwm = 128) {
    this.mode = enabled ? 'manual' : 'automatic';
    this.manualPWM = pwm;
  }

  // Set simulation mode
  setSimulationMode(enabled, sunlight = 300, occupancy = 0) {
    this.simulationMode = enabled;
    this.simulatedSunlight = sunlight;
    this.simulatedOccupancy = occupancy;
  }

  updateSimulation(sunlight, occupancy) {
    this.simulatedSunlight = sunlight;
    this.simulatedOccupancy = occupancy;
  }
}

const simulator = new SensorSimulator();

// Socket.io Connection Handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Send initial data
  socket.emit('sensorData', simulator.generateReading());

  // Handle simulation mode toggle
  socket.on('setSimulationMode', (data) => {
    console.log('📡 Simulation mode:', data);
    simulator.setSimulationMode(data.enabled, data.sunlight, data.occupancy);
    io.emit('sensorData', simulator.generateReading());
  });

  // Handle simulation updates
  socket.on('updateSimulation', (data) => {
    simulator.updateSimulation(data.sunlight, data.occupancy);
    io.emit('sensorData', simulator.generateReading());
  });

  // Handle manual mode
  socket.on('setManualMode', (data) => {
    console.log('🎛️ Manual mode:', data);
    simulator.setManualMode(data.enabled, data.pwm);
    io.emit('sensorData', simulator.generateReading());
  });

  // Handle manual PWM adjustment
  socket.on('setManualPWM', (pwm) => {
    simulator.manualPWM = pwm;
    io.emit('sensorData', simulator.generateReading());
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Emit sensor data every 2 seconds
setInterval(async () => {
  const reading = simulator.generateReading();
  io.emit('sensorData', reading);

  // Save to database if connected
  if (mongoose.connection.readyState === 1) {
    try {
      const log = new SensorLog({
        timestamp: reading.timestamp,
        occupancyCount: reading.occupancyCount,
        ambientLux: reading.ambientLux,
        ledOutputPWM: reading.ledOutputPWM,
        energyConsumedWatts: reading.energyConsumedWatts,
        mode: reading.mode,
        targetLux: reading.targetLux
      });
      await log.save();
    } catch (error) {
      // Silent fail for database saves
    }
  }
}, 2000);

// Generate historical data for demo (24 hours)
const generateHistoricalData = async () => {
  if (mongoose.connection.readyState !== 1) return;

  const count = await SensorLog.countDocuments();
  if (count > 0) {
    console.log('📊 Historical data already exists');
    return;
  }

  console.log('📊 Generating historical data...');
  const now = new Date();
  const logs = [];

  for (let i = 24 * 60; i >= 0; i -= 5) { // Every 5 minutes for 24 hours
    const timestamp = new Date(now.getTime() - i * 60 * 1000);
    const hour = timestamp.getHours();

    // Simulate realistic patterns
    let ambientLux, occupancy;
    
    if (hour >= 6 && hour < 10) {
      ambientLux = 200 + (hour - 6) * 100 + Math.random() * 50;
      occupancy = 5 + Math.floor(Math.random() * 10);
    } else if (hour >= 10 && hour < 16) {
      ambientLux = 600 + Math.random() * 200;
      occupancy = 15 + Math.floor(Math.random() * 15);
    } else if (hour >= 16 && hour < 20) {
      ambientLux = 600 - (hour - 16) * 100 + Math.random() * 50;
      occupancy = 10 + Math.floor(Math.random() * 10);
    } else {
      ambientLux = 50 + Math.random() * 50;
      occupancy = Math.floor(Math.random() * 3);
    }

    const targetLux = 500;
    const luxDeficit = Math.max(0, targetLux - ambientLux);
    const pwm = occupancy > 0 ? Math.min(255, Math.round((luxDeficit / 500) * 255)) : 0;
    const energy = (pwm / 255) * 50;

    logs.push({
      timestamp,
      occupancyCount: occupancy,
      ambientLux: Math.round(ambientLux),
      ledOutputPWM: pwm,
      energyConsumedWatts: parseFloat(energy.toFixed(2)),
      mode: 'automatic',
      targetLux: 500
    });
  }

  await SensorLog.insertMany(logs);
  console.log(`✅ Generated ${logs.length} historical records`);
};

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await generateHistoricalData();
  
  server.listen(PORT, () => {
    console.log(`
    🚀 Smart LED Dashboard Backend
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📡 Server running on port ${PORT}
    🔌 Socket.io ready for connections
    📊 API available at http://localhost:${PORT}/api
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  });
};

startServer();
