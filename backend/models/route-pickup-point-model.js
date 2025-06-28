const mongoose = require('mongoose');

const routePickupPointSchema = new mongoose.Schema({
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransportRoute',
    required: true,
  },
  pickup: {
    point: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupPoint',
      required: true,
    },
    fee: {
      type: Number,
      required: true,
      min: 0,
    },
    distance: {
      type: Number,
      required: true,
      min: 0,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('RoutePickupPoint', routePickupPointSchema);