const Store = require('../models/store-model');
const mongoose = require('mongoose');

// Create Store
exports.createStore = async (req, res) => {
  try {
    console.log("Creating Store:", req.body);
    const { storeName, storeCode, description, adminID } = req.body;
 
    if (!storeName || !storeCode || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    } 

    const existingStore = await Store.findOne({
      storeCode,
      createdBy: adminID
    });

    if (existingStore) {
      return res.status(400).json({ message: 'Store code already exists' });
    }

    const newStore = new Store({
      storeName,
      storeCode,
      description,
      createdBy: adminID
    });

    await newStore.save();
    res.status(201).json({ success: true, store: newStore });
  } catch (error) {
     console.error("Error in createstore:", error);
    res.status(500).json({ error: error.message });
   
  }
};

// Get All Stores


// Get Stores by adminID (via query param)
exports.getStores = async (req, res) => {
  try {
    const { adminID } = req.query;

    console.log("adminID from query:", adminID); // Debugging

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    // Fetch stores created by this admin
    const stores = await Store.find({ createdBy: new mongoose.Types.ObjectId(adminID) });

    console.log("Fetched stores count:", stores.length);
    res.status(200).json(stores);
  } catch (error) {
    console.error("Error in getStores:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Store By ID
exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Update Store
exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      {
        storeName: req.body.storeName,
        storeCode: req.body.storeCode,
        description: req.body.description
      },
      { new: true }
    );

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Store
/* exports.deleteStore = async (req, res) => {
  try {
    await Store.findByIdAndDelete(req.params.id);

     res.status(200).json({ message: 'Store deleted' });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; */
exports.deleteStore = async (req, res) => {
    try {
        await Store.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Store deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
