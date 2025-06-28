const mongoose = require('mongoose');
const Vehicle = require('../models/vehicle-model');

exports.getVehicles = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching vehicles for adminID: ${adminID}`);
    const vehicles = await Vehicle.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${vehicles.length} vehicles for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Vehicles fetched successfully',
      data: vehicles,
      count: vehicles.length,
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error.message);
    res.status(500).json({ message: 'Server error while fetching vehicles', error: error.message });
  }
};

exports.addVehicle = async (req, res) => {
  try {
    const { number, model, year, regNumber, chassis, capacity, driver, license, contact, adminID } = req.body;
    if (!number || !model || !year || !regNumber || !chassis || !capacity || !driver || !license || !contact || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const newVehicle = new Vehicle({
      number,
      model,
      year,
      regNumber,
      chassis,
      capacity,
      driver,
      license,
      contact,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    await newVehicle.save();
    res.status(201).json({ message: 'Vehicle added successfully', data: newVehicle });
  } catch (error) {
    console.error('Error adding vehicle:', error.message);
    res.status(500).json({ message: 'Server error while adding vehicle', error: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { number, model, year, regNumber, chassis, capacity, driver, license, contact, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const vehicle = await Vehicle.findOne({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    vehicle.number = number || vehicle.number;
    vehicle.model = model || vehicle.model;
    vehicle.year = year || vehicle.year;
    vehicle.regNumber = regNumber || vehicle.regNumber;
    vehicle.chassis = chassis || vehicle.chassis;
    vehicle.capacity = capacity || vehicle.capacity;
    vehicle.driver = driver || vehicle.driver;
    vehicle.license = license || vehicle.license;
    vehicle.contact = contact || vehicle.contact;
    await vehicle.save();
    res.status(200).json({ message: 'Vehicle updated successfully', data: vehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error.message);
    res.status(500).json({ message: 'Server error while updating vehicle', error: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error.message);
    res.status(500).json({ message: 'Server error while deleting vehicle', error: error.message });
  }
};