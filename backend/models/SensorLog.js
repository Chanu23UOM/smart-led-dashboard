const mongoose = require('mongoose');

const SensorLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
    index: true
  },
  occupancyCount: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  ambientLux: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
    default: 0
  },
  ledOutputPWM: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
    default: 0
  },
  energyConsumedWatts: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  mode: {
    type: String,
    enum: ['automatic', 'manual', 'energy_saving'],
    default: 'automatic'
  },
  targetLux: {
    type: Number,
    default: 500 // EN 12464-1 Standard for study areas
  }
}, {
  timestamps: true,
  collection: 'sensor_logs'
});

// Index for efficient time-based queries
SensorLogSchema.index({ timestamp: -1 });
SensorLogSchema.index({ createdAt: -1 });

// Static method to get hourly aggregated data
SensorLogSchema.statics.getHourlyData = async function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $group: {
        _id: { $hour: '$timestamp' },
        avgOccupancy: { $avg: '$occupancyCount' },
        avgLux: { $avg: '$ambientLux' },
        avgPWM: { $avg: '$ledOutputPWM' },
        totalEnergy: { $sum: '$energyConsumedWatts' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

// Static method to calculate energy savings
SensorLogSchema.statics.calculateEnergySavings = async function(startDate, endDate) {
  const data = await this.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalSmartEnergy: { $sum: '$energyConsumedWatts' },
        avgPWM: { $avg: '$ledOutputPWM' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (data.length === 0) return { smartEnergy: 0, staticEnergy: 0, savings: 0 };

  const smartEnergy = data[0].totalSmartEnergy;
  // Static system would consume at full brightness (PWM 255) constantly
  const staticEnergy = data[0].count * (255 / 255) * 50; // Assuming 50W max consumption
  const savings = ((staticEnergy - smartEnergy) / staticEnergy) * 100;

  return {
    smartEnergy: smartEnergy.toFixed(2),
    staticEnergy: staticEnergy.toFixed(2),
    savingsPercent: savings.toFixed(1)
  };
};

module.exports = mongoose.model('SensorLog', SensorLogSchema);
