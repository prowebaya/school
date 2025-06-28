const mongoose = require('mongoose');
const RoutePickupPoint = require('../models/route-pickup-point-model');
const TransportRoute = require('../models/route-model');
const PickupPoint = require('../models/pickup-point-model');

exports.getRoutePickupPoints = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching route pickup points for adminID: ${adminID}`);
    const routePickupPoints = await RoutePickupPoint.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .populate('route', 'title')
      .populate('pickup.point', 'name')
      .sort({ createdAt: -1 })
      .lean();
    
    // Group by route for frontend compatibility
    const groupedByRoute = routePickupPoints.reduce((acc, item) => {
      const routeTitle = item.route?.title || 'Unknown';
      if (!acc[routeTitle]) {
        acc[routeTitle] = {
          route: routeTitle,
          pickups: [],
        };
      }
      acc[routeTitle].pickups.push({
        _id: item._id,
        point: item.pickup.point?.name || 'Unknown',
        pointId: item.pickup.point?._id,
        fee: item.pickup.fee,
        distance: item.pickup.distance,
        time: item.pickup.time,
      });
      return acc;
    }, {});
    
    const formattedData = Object.values(groupedByRoute);
    console.log(`Found ${formattedData.length} routes with pickup points for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Route pickup points fetched successfully',
      data: formattedData,
      count: formattedData.length,
    });
  } catch (error) {
    console.error('Error fetching route pickup points:', error.message);
    res.status(500).json({ message: 'Server error while fetching route pickup points', error: error.message });
  }
};

exports.addRoutePickupPoint = async (req, res) => {
  try {
    const { routeId, pointId, fee, distance, time, adminID } = req.body;
    if (!routeId || !pointId || !fee || !distance || !time || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(routeId) || !mongoose.Types.ObjectId.isValid(pointId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const routeExists = await TransportRoute.findById(routeId);
    const pointExists = await PickupPoint.findById(pointId);
    if (!routeExists || !pointExists) {
      return res.status(404).json({ message: 'Route or pickup point not found' });
    }
    const newRoutePickupPoint = new RoutePickupPoint({
      route: new mongoose.Types.ObjectId(routeId),
      pickup: {
        point: new mongoose.Types.ObjectId(pointId),
        fee: parseFloat(fee),
        distance: parseFloat(distance),
        time,
      },
      admin: new mongoose.Types.ObjectId(adminID),
    });
    await newRoutePickupPoint.save();
    const populatedRoutePickupPoint = await RoutePickupPoint.findById(newRoutePickupPoint._id)
      .populate('route', 'title')
      .populate('pickup.point', 'name')
      .lean();
    res.status(201).json({
      message: 'Route pickup point added successfully',
      data: {
        _id: populatedRoutePickupPoint._id,
        route: populatedRoutePickupPoint.route?.title || 'Unknown',
        pickup: {
          point: populatedRoutePickupPoint.pickup.point?.name || 'Unknown',
          pointId: populatedRoutePickupPoint.pickup.point?._id,
          fee: populatedRoutePickupPoint.pickup.fee,
          distance: populatedRoutePickupPoint.pickup.distance,
          time: populatedRoutePickupPoint.pickup.time,
        },
      },
    });
  } catch (error) {
    console.error('Error adding route pickup point:', error.message);
    res.status(500).json({ message: 'Server error while adding route pickup point', error: error.message });
  }
};

exports.updateRoutePickupPoint = async (req, res) => {
  try {
    const { routeId, pointId, fee, distance, time, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(routeId) || !mongoose.Types.ObjectId.isValid(pointId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const routePickupPoint = await RoutePickupPoint.findOne({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!routePickupPoint) {
      return res.status(404).json({ message: 'Route pickup point not found' });
    }
    const routeExists = await TransportRoute.findById(routeId);
    const pointExists = await PickupPoint.findById(pointId);
    if (!routeExists || !pointExists) {
      return res.status(404).json({ message: 'Route or pickup point not found' });
    }
    routePickupPoint.route = new mongoose.Types.ObjectId(routeId);
    routePickupPoint.pickup = {
      point: new mongoose.Types.ObjectId(pointId),
      fee: parseFloat(fee) || routePickupPoint.pickup.fee,
      distance: parseFloat(distance) || routePickupPoint.pickup.distance,
      time: time || routePickupPoint.pickup.time,
    };
    await routePickupPoint.save();
    const populatedRoutePickupPoint = await RoutePickupPoint.findById(routePickupPoint._id)
      .populate('route', 'title')
      .populate('pickup.point', 'name')
      .lean();
    res.status(200).json({
      message: 'Route pickup point updated successfully',
      data: {
        _id: populatedRoutePickupPoint._id,
        route: populatedRoutePickupPoint.route?.title || 'Unknown',
        pickup: {
          point: populatedRoutePickupPoint.pickup.point?.name || 'Unknown',
          pointId: populatedRoutePickupPoint.pickup.point?._id,
          fee: populatedRoutePickupPoint.pickup.fee,
          distance: populatedRoutePickupPoint.pickup.distance,
          time: populatedRoutePickupPoint.pickup.time,
        },
      },
    });
  } catch (error) {
    console.error('Error updating route pickup point:', error.message);
    res.status(500).json({ message: 'Server error while updating route pickup point', error: error.message });
  }
};

exports.deleteRoutePickupPoint = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const routePickupPoint = await RoutePickupPoint.findOneAndDelete({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!routePickupPoint) {
      return res.status(404).json({ message: 'Route pickup point not found' });
    }
    res.status(200).json({ message: 'Route pickup point deleted successfully' });
  } catch (error) {
    console.error('Error deleting route pickup point:', error.message);
    res.status(500).json({ message: 'Server error while deleting route pickup point', error: error.message });
  }
};