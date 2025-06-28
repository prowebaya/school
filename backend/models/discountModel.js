const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Discount name is required'],
      trim: true,
      maxlength: [100, 'Discount name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Discount code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [20, 'Discount code cannot exceed 20 characters'],
    },
    type: {
      type: String,
      enum: ['percentage', 'amount'],
      required: [true, 'Discount type is required'],
      default: 'percentage',
    },
    percentage: {
      type: Number,
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot exceed 100'],
      required: function () {
        return this.type === 'percentage';
      },
    },
    amount: {
      type: Number,
      min: [0, 'Amount cannot be negative'],
      required: function () {
        return this.type === 'amount';
      },
    },
    useCount: {
      type: Number,
      min: [0, 'Use count cannot be negative'],
      default: 0,
    },
    expiry: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: [true, 'School is required'],
    },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, code: 1 }, unique: true },
      { key: { school: 1, name: 1 } },
    ],
  }
);

module.exports = mongoose.model('Discount', discountSchema);