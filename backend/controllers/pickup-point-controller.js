const mongoose = require('mongoose');
const PickupPoint = require('../models/pickup-point-model');

exports.getPickupPoints = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching pickup points for adminID: ${adminID}`);
    const pickupPoints = await PickupPoint.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${pickupPoints.length} pickup points for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Pickup points fetched successfully',
      data: pickupPoints,
      count: pickupPoints.length,
    });
  } catch (error) {
    console.error('Error fetching pickup points:', error.message);
    res.status(500).json({ message: 'Server error while fetching pickup points', error: error.message });
  }
};

exports.addPickupPoint = async (req, res) => {
  try {
    const { name, lat, lng, adminID } = req.body;
    if (!name || !lat || !lng || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const existingPoint = await PickupPoint.findOne({ name, admin: new mongoose.Types.ObjectId(adminID) });
    if (existingPoint) {
      return res.status(400).json({ message: 'Pickup point name already exists' });
    }
    const newPickupPoint = new PickupPoint({
      name,
      lat,
      lng,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    await newPickupPoint.save();
    res.status(201).json({ message: 'Pickup point added successfully', data: newPickupPoint });
  } catch (error) {
    console.error('Error adding pickup point:', error.message);
    res.status(500).json({ message: 'Server error while adding pickup point', error: error.message });
  }
};

exports.updatePickupPoint = async (req, res) => {
  try {
    const { name, lat, lng, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const pickupPoint = await PickupPoint.findOne({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!pickupPoint) {
      return res.status(404).json({ message: 'Pickup point not found' });
    }
    const existingPoint = await PickupPoint.findOne({ name, admin: new mongoose.Types.ObjectId(adminID), _id: { $ne: req.params.id } });
    if (existingPoint) {
      return res.status(400).json({ message: 'Pickup point name already exists' });
    }
    pickupPoint.name = name || pickupPoint.name;
    pickupPoint.lat = lat || pickupPoint.lat;
    pickupPoint.lng = lng || pickupPoint.lng;
    await pickupPoint.save();
    res.status(200).json({ message: 'Pickup point updated successfully', data: pickupPoint });
  } catch (error) {
    console.error('Error updating pickup point:', error.message);
    res.status(500).json({ message: 'Server error while updating pickup point', error: error.message });
  }
};

exports.deletePickupPoint = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const pickupPoint = await PickupPoint.findOneAndDelete({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!pickupPoint) {
      return res.status(404).json({ message: 'Pickup point not found' });
    }
    res.status(200).json({ message: 'Pickup point deleted successfully' });
  } catch (error) {
    console.error('Error deleting pickup point:', error.message);
    res.status(500).json({ message: 'Server error while deleting pickup point', error: error.message });
  }
};