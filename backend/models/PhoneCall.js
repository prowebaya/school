const mongoose = require("mongoose");

const phoneCallLogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    followUpDate: { type: Date, required: true },
    duration: { type: String, required: true },
    note: { type: String, required: true },
    callType: { type: String, enum: ["Incoming", "Outgoing"], required: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PhoneCallLog", phoneCallLogSchema);