// Division Model (models/division-model.js)
const mongoose = require('mongoose');

const divisionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  percentFrom: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  percentUpto: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// ✅ Define compound index properly:
divisionSchema.index({ name: 1, createdBy: 1 }, { unique: true });

// ✅ Validate that percentFrom > percentUpto
divisionSchema.pre('validate', function(next) {
  if (this.percentFrom <= this.percentUpto) {
    this.invalidate('percentFrom', 'From percentage must be greater than To percentage');
  }
  next();
});

module.exports = mongoose.model('Division', divisionSchema);
