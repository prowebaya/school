
const Supplier = require('../models/supplierModel');
const mongoose = require('mongoose');

// Create Supplier
exports.createSupplier = async (req, res) => {
  try {
    console.log("Creating Supplier:", req.body);
    const {
      name,
      phone,
      email,
      address,
      contactPersonName,
      contactPersonPhone,
      contactPersonEmail,
      description,
      adminID
    } = req.body;

     // Validate required fields
    if (!name || !adminID) {
      return res.status(400).json({ message: 'Name and Admin ID are required' });
    }

    const existingSupplier = await Supplier.findOne({
      name,
      createdBy: adminID
    });

    if (existingSupplier) {
      return res.status(400).json({ message: 'Supplier with the same name already exists' });
    }

    const newSupplier = new Supplier({
      name,
      phone,
      email,
      address,
      contactPersonName,
      contactPersonPhone,
      contactPersonEmail,
      description,
      createdBy: adminID
    });

    await newSupplier.save();
    res.status(201).json({ success: true, supplier: newSupplier });
  } catch (error) {
    console.error("Error in createSupplier:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Suppliers
/* exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; */
/* 
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ createdBy: req.user._id });
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; */

exports.getSuppliers = async (req, res) => {
  try {
    const { adminID } = req.query;
    

    console.log("adminID from query:", adminID); // Debugging

   /*  if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
 */

    //const suppliers = await Supplier.find({ createdBy: adminID });
    
    const suppliers = await Supplier.find({ createdBy: new mongoose.Types.ObjectId(adminID) });
    console.log("Fetched suppliers count:", suppliers.length);
    console.log("adminID:", adminID, "Type:", typeof adminID);
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error in getSuppliers:", error);
    res.status(500).json({ error: error.message });
  }
};



// Get Supplier By ID
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Supplier
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        contactPersonName: req.body.contactPersonName,
        contactPersonPhone: req.body.contactPersonPhone,
        contactPersonEmail: req.body.contactPersonEmail,
        description: req.body.description
      },
      { new: true }
    );

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Supplier
exports.deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Supplier deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
