import express from 'express';
import MachineData from '../models/MachineData.js';

const router = express.Router();

// POST route to receive machine data
router.post('/data', async (req, res) => {
  try {
    const { machineId, ...readingData } = req.body;

    const newReading = new MachineData({
      machineId,
      ...readingData,
    });

    await newReading.save();
    res.status(201).json({ message: 'Reading saved' });
  } catch (error) {
    console.error('❌ Error saving reading:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/:machineId/latest', async (req, res) => {
  try {
    const { machineId} = req.params;
    const latestReading = await MachineData.findOne({ machineId })
      .sort({ timestamp: -1 })
      .lean();

    if (!latestReading) {
      return res.status(404).json({ message: 'No data found' });
    }

    res.json(latestReading);
  } catch (error) {
    console.error('❌ Error fetching latest reading:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', async (req, res) => {
  try {
    const machineIds = await MachineData.distinct('machineId');
    res.json(machineIds);
  } catch (error) {
    console.error('❌ Error fetching machine Ids:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:machineId/history', async (req, res) => {
  try {
    const { machineId } = req.params;
    const limit = parseInt(req.query.limit) || 20;

    // Support shorter durations via `minutes` or default to 24 hours
    const minutes = parseInt(req.query.minutes);
    const hours = parseInt(req.query.hours);

    let timeThreshold;

    if (!isNaN(minutes)) {
      timeThreshold = new Date(Date.now() - minutes * 60 * 1000);
    } else if (!isNaN(hours)) {
      timeThreshold = new Date(Date.now() - hours * 60 * 60 * 1000);
    } else {
      timeThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000); // Default 24h
    }

    const historicalData = await MachineData.find({
      machineId: machineId,
      timestamp: { $gte: timeThreshold }
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .select('timestamp airTemperature processTemperature rotationalSpeed torque toolWear machineFailure');

    const chronologicalData = historicalData.reverse();

    const chartData = {
      timestamps: chronologicalData.map(d => new Date(d.timestamp).toLocaleTimeString()),
      torqueData: chronologicalData.map(d => d.torque),
      speedData: chronologicalData.map(d => d.rotationalSpeed),
      wearData: chronologicalData.map(d => d.toolWear),
      tempDiffData: chronologicalData.map(d => d.processTemperature - d.airTemperature),
      airTempData: chronologicalData.map(d => d.airTemperature),
      processTempData: chronologicalData.map(d => d.processTemperature),
      failureData: chronologicalData.map(d => d.machineFailure),
      powerData: chronologicalData.map(d => (d.rotationalSpeed * d.torque / 9.5488).toFixed(0))
    };

    res.status(200).json({
      success: true,
      machineId,
      dataPoints: chronologicalData.length,
      timeRange: minutes
        ? `Last ${minutes} minutes`
        : `Last ${hours || 24} hours`,
      data: chartData
    });

  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch historical data',
      error: error.message
    });
  }
});

// Get aggregated statistics for a machine
router.get('/:machineId/stats', async (req, res) => {
  try {
    const { machineId } = req.params;
    const hours = parseInt(req.query.hours) || 24;
    
    const timeThreshold = new Date(Date.now() - (hours * 60 * 60 * 1000));

    const stats = await MachineData.aggregate([
      {
        $match: {
          machineId: machineId,
          timestamp: { $gte: timeThreshold }
        }
      },
      {
        $group: {
          _id: null,
          avgTorque: { $avg: "$torque" },
          maxTorque: { $max: "$torque" },
          minTorque: { $min: "$torque" },
          avgSpeed: { $avg: "$rotationalSpeed" },
          maxSpeed: { $max: "$rotationalSpeed" },
          minSpeed: { $min: "$rotationalSpeed" },
          avgToolWear: { $avg: "$toolWear" },
          maxToolWear: { $max: "$toolWear" },
          avgAirTemp: { $avg: "$airTemperature" },
          avgProcessTemp: { $avg: "$processTemperature" },
          totalFailures: { $sum: "$machineFailure" },
          totalDataPoints: { $sum: 1 }
        }
      }
    ]);

    const result = stats[0] || {};
    
    // Calculate uptime percentage
    const uptimePercentage = result.totalDataPoints ? 
      ((result.totalDataPoints - (result.totalFailures || 0)) / result.totalDataPoints * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      machineId,
      timeRange: `Last ${hours} hours`,
      stats: {
        ...result,
        uptimePercentage: parseFloat(uptimePercentage),
        avgTempDifference: (result.avgProcessTemp - result.avgAirTemp).toFixed(2)
      }
    });

  } catch (error) {
    console.error('Error fetching machine stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch machine statistics',
      error: error.message 
    });
  }
});

// Get all machines summary
router.get('/summary', async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 1; // Default to last hour for summary
    const timeThreshold = new Date(Date.now() - (hours * 60 * 60 * 1000));

    // Get latest data for each machine
    const machines = await MachineData.aggregate([
      {
        $match: {
          timestamp: { $gte: timeThreshold }
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: "$machineId",
          latestData: { $first: "$$ROOT" },
          totalFailures: { $sum: "$machineFailure" },
          dataPoints: { $sum: 1 }
        }
      },
      {
        $project: {
          machineId: "$_id",
          latestData: 1,
          totalFailures: 1,
          dataPoints: 1,
          uptimePercentage: {
            $multiply: [
              { $divide: [{ $subtract: ["$dataPoints", "$totalFailures"] }, "$dataPoints"] },
              100
            ]
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      timeRange: `Last ${hours} hours`,
      totalMachines: machines.length,
      machines: machines
    });

  } catch (error) {
    console.error('Error fetching machines summary:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch machines summary',
      error: error.message 
    });
  }
});

export default router;