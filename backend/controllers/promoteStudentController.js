const mongoose = require('mongoose');
const Promotion = require('../models/promoteStudentModel');
const AdmissionForm = require('../models/admissionHubModel.js');
const Fclass = require('../models/fclass-model');

exports.getPromotions = async (req, res) => {
  try {
    const { adminID, className, section, session } = req.query;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    if (!className || !section || !session) {
      return res.status(400).json({ message: 'Class, section, and session are required' });
    }

    const promotions = await Promotion.find({
      admin: new mongoose.Types.ObjectId(adminID),
      class: className,
      section,
      session,
    }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      message: 'Promotions fetched successfully',
      data: promotions,
      count: promotions.length,
    });
  } catch (error) {
    console.error('Error fetching promotions:', error.message);
    res.status(500).json({ message: 'Server error while fetching promotions', error: error.message });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentResult, nextSessionStatus, adminID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid ID format for promotion or admin' });
    }

    const promotion = await Promotion.findOneAndUpdate(
      { _id: id, admin: adminID },
      { currentResult, nextSessionStatus },
      { new: true }
    );

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.status(200).json({ message: 'Promotion updated successfully', data: promotion });
  } catch (error) {
    console.error('Error updating promotion:', error.message);
    res.status(500).json({ message: 'Server error while updating promotion', error: error.message });
  }
};

exports.promotePromotions = async (req, res) => {
  try {
    const { promotionIds, promoteClass, promoteSection, promoteSession, adminID } = req.body;

    if (!promotionIds || !Array.isArray(promotionIds) || promotionIds.length === 0) {
      return res.status(400).json({ message: 'At least one promotion ID is required' });
    }

    if (!promotionIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ message: 'One or more promotion IDs are invalid' });
    }

    if (!promoteClass || !promoteSection || !promoteSession) {
      return res.status(400).json({ message: 'Promote class, section, and session are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    const fclass = await Fclass.findOne({ name: promoteClass, sections: promoteSection, admin: adminID });
    console.log('Fclass query result:', fclass); // Debug class/section
    if (!fclass) {
      return res.status(400).json({ message: `Invalid class (${promoteClass}) or section (${promoteSection}) for admin ${adminID}` });
    }

    const updatedPromotions = await Promotion.updateMany(
      { _id: { $in: promotionIds }, admin: adminID },
      { class: promoteClass, section: promoteSection, session: promoteSession }
    );

    const admissionUpdate = await AdmissionForm.updateMany(
      { _id: { $in: promotionIds }, school: adminID },
      { classId: fclass._id, section: promoteSection }
    );

    if (updatedPromotions.matchedCount === 0) {
      return res.status(404).json({ message: 'No promotions found for the provided IDs' });
    }

    if (admissionUpdate.matchedCount === 0) {
      console.warn('No admission forms updated for provided IDs');
    }

    res.status(200).json({ message: `Successfully promoted ${updatedPromotions.modifiedCount} students` });
  } catch (error) {
    console.error('Error promoting promotions:', error.message);
    res.status(500).json({ message: 'Server error while promoting', error: error.message });
  }
};