const mongoose = require('mongoose');
const TransportRoute = require('../models/route-model');

exports.getTransportRoutes = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching transport routes for adminID: ${adminID}`);
    const transportRoutes = await TransportRoute.find({ school: new mongoose.Types.ObjectId(adminID) });
    res.status(200).json({ message: 'Transport routes fetched successfully', data: transportRoutes });
  } catch (error) {
    console.error('Error fetching transport routes:', error.message);
    res.status(500).json({ message: 'Server error while fetching transport routes', error: error.message });
  }
};

exports.addTransportRoute = async (req, res) => {
  try {
    const { title, adminID } = req.body;
    if (!title || !adminID) {
      return res.status(400).json({ message: 'Title and adminID are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Adding transport route: ${title}, adminID: ${adminID}`);
    const transportRoute = new TransportRoute({
      title: title.trim(),
      school: new mongoose.Types.ObjectId(adminID),
    });
    await transportRoute.save();
    res.status(201).json({ message: 'Transport route created successfully', data: transportRoute });
  } catch (error) {
    console.error('Error creating transport route:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Transport route title already exists for this school' });
    }
    res.status(500).json({ message: 'Server error while creating transport route', error: error.message });
  }
};

exports.updateTransportRoute = async (req, res) => {
  try {
    const { title, adminID } = req.body;
    if (!adminID) {
      return res.status(400).json({ message: 'AdminID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Updating transport route with ID: ${req.params.id}, adminID: ${adminID}`);
    const transportRoute = await TransportRoute.findOne({
      _id: req.params.id,
      school: new mongoose.Types.ObjectId(adminID),
    });
    if (!transportRoute) {
      console.log(`Transport route not found for ID: ${req.params.id}, adminID: ${adminID}`);
      return res.status(404).json({ message: 'Transport route not found' });
    }
    if (title) transportRoute.title = title.trim();
    await transportRoute.save();
    console.log('Updated transport route:', transportRoute);
    res.status(200).json({ message: 'Transport route updated successfully', data: transportRoute });
  } catch (error) {
    console.error('Error updating transport route:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Transport route title already exists for this school' });
    }
    res.status(500).json({ message: 'Server error while updating transport route', error: error.message });
  }
};

exports.deleteTransportRoute = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!adminID) {
      return res.status(400).json({ message: 'AdminID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Deleting transport route with ID: ${req.params.id}, adminID: ${adminID}`);
    const transportRoute = await TransportRoute.findOneAndDelete({
      _id: req.params.id,
      school: new mongoose.Types.ObjectId(adminID),
    });
    if (!transportRoute) {
      console.log(`Transport route not found for ID: ${req.params.id}, adminID: ${adminID}`);
      return res.status(404).json({ message: 'Transport route not found' });
    }
    console.log('Deleted transport route:', transportRoute);
    res.status(200).json({ message: 'Transport route deleted successfully' });
  } catch (error) {
    console.error('Error deleting transport route:', error.message);
    res.status(500).json({ message: 'Server error while deleting transport route', error: error.message });
  }
};