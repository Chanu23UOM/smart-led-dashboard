const express = require('express');
const router = express.Router();
const SensorLog = require('../models/SensorLog');

// Get all sensor logs with pagination
router.get('/logs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const logs = await SensorLog.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SensorLog.countDocuments();

    res.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get latest sensor reading
router.get('/logs/latest', async (req, res) => {
  try {
    const latest = await SensorLog.findOne().sort({ timestamp: -1 });
    res.json({ success: true, data: latest });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new sensor log
router.post('/logs', async (req, res) => {
  try {
    const log = new SensorLog(req.body);
    await log.save();
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get hourly aggregated data for a specific date
router.get('/analytics/hourly', async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const hourlyData = await SensorLog.getHourlyData(date);
    res.json({ success: true, data: hourlyData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get energy savings comparison
router.get('/analytics/savings', async (req, res) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (parseInt(req.query.days) || 7));

    const savings = await SensorLog.calculateEnergySavings(startDate, endDate);
    res.json({ success: true, data: savings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get occupancy heatmap data
router.get('/analytics/heatmap', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const heatmapData = await SensorLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: '$timestamp' },
            hour: { $hour: '$timestamp' }
          },
          avgOccupancy: { $avg: '$occupancyCount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.dayOfWeek': 1, '_id.hour': 1 }
      }
    ]);

    res.json({ success: true, data: heatmapData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get light stability data (scatter plot)
router.get('/analytics/stability', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 200;
    
    const stabilityData = await SensorLog.find()
      .select('ambientLux ledOutputPWM timestamp')
      .sort({ timestamp: -1 })
      .limit(limit);

    // Calculate total lux (ambient + LED contribution)
    const processedData = stabilityData.map(log => ({
      ambientLux: log.ambientLux,
      ledContribution: (log.ledOutputPWM / 255) * 500, // Max LED contribution is 500 lux
      totalLux: log.ambientLux + (log.ledOutputPWM / 255) * 500,
      timestamp: log.timestamp
    }));

    res.json({ success: true, data: processedData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// System stats endpoint
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalLogs, todayLogs, avgEnergy] = await Promise.all([
      SensorLog.countDocuments(),
      SensorLog.countDocuments({ timestamp: { $gte: today } }),
      SensorLog.aggregate([
        { $group: { _id: null, avg: { $avg: '$energyConsumedWatts' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalLogs,
        todayLogs,
        avgEnergyConsumption: avgEnergy[0]?.avg?.toFixed(2) || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
