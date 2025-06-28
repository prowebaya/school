const mongoose = require('mongoose');
const Assignment = require('../models/Assignment-Model');
const Vehicle = require('../models/vehicle-model');
const TransportRoute = require('../models/route-model');

exports.getAssignments = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching assignments for adminID: ${adminID}`);
    const assignments = await Assignment.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .populate('route', 'title')
      .populate('vehicle', 'number')
      .sort({ createdAt: -1 })
      .lean();
    const formattedAssignments = assignments.map((a) => ({
      _id: a._id,
      route: a.route?.title || 'Unknown',
      vehicle: a.vehicle?.number || 'Unknown',
      routeId: a.route?._id,
      vehicleId: a.vehicle?._id,
      admin: a.admin,
      createdAt: a.createdAt,
    }));
    console.log(`Found ${assignments.length} assignments for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Assignments fetched successfully',
      data: formattedAssignments,
      count: assignments.length,
    });
  } catch (error) {
    console.error('Error fetching assignments:', error.message);
    res.status(500).json({ message: 'Server error while fetching assignments', error: error.message });
  }
};

exports.addAssignment = async (req, res) => {
  try {
    const { route, vehicle, adminID } = req.body;
    if (!route || !vehicle || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(route) || !mongoose.Types.ObjectId.isValid(vehicle)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const routeExists = await TransportRoute.findById(route);
    const vehicleExists = await Vehicle.findById(vehicle);
    if (!routeExists || !vehicleExists) {
      return res.status(404).json({ message: 'Route or vehicle not found' });
    }
    const newAssignment = new Assignment({
      route: new mongoose.Types.ObjectId(route),
      vehicle: new mongoose.Types.ObjectId(vehicle),
      admin: new mongoose.Types.ObjectId(adminID),
    });
    await newAssignment.save();
    const populatedAssignment = await Assignment.findById(newAssignment._id)
      .populate('route', 'title')
      .populate('vehicle', 'number')
      .lean();
    res.status(201).json({
      message: 'Assignment added successfully',
      data: {
        _id: populatedAssignment._id,
        route: populatedAssignment.route?.title || 'Unknown',
        vehicle: populatedAssignment.vehicle?.number || 'Unknown',
        routeId: populatedAssignment.route?._id,
        vehicleId: populatedAssignment.vehicle?._id,
        admin: populatedAssignment.admin,
        createdAt: populatedAssignment.createdAt,
      },
    });
  } catch (error) {
    console.error('Error adding assignment:', error.message);
    res.status(500).json({ message: 'Server error while adding assignment', error: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { route, vehicle, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(route) || !mongoose.Types.ObjectId.isValid(vehicle)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const assignment = await Assignment.findOne({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    const routeExists = await TransportRoute.findById(route);
    const vehicleExists = await Vehicle.findById(vehicle);
    if (!routeExists || !vehicleExists) {
      return res.status(404).json({ message: 'Route or vehicle not found' });
    }
    assignment.route = new mongoose.Types.ObjectId(route);
    assignment.vehicle = new mongoose.Types.ObjectId(vehicle);
    await assignment.save();
    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('route', 'title')
      .populate('vehicle', 'number')
      .lean();
    res.status(200).json({
      message: 'Assignment updated successfully',
      data: {
        _id: populatedAssignment._id,
        route: populatedAssignment.route?.title || 'Unknown',
        vehicle: populatedAssignment.vehicle?.number || 'Unknown',
        routeId: populatedAssignment.route?._id,
        vehicleId: populatedAssignment.vehicle?._id,
        admin: populatedAssignment.admin,
        createdAt: populatedAssignment.createdAt,
      },
    });
  } catch (error) {
    console.error('Error updating assignment:', error.message);
    res.status(500).json({ message: 'Server error while updating assignment', error: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error.message);
    res.status(500).json({ message: 'Server error while deleting assignment', error: error.message });
  }
};