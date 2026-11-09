
const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String
  },
  description: {
    type: String,
    trim: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    enum: ["excellent", "good", "fair", "poor"],
    required: true
  },
  notes: {
    type: String
  },
  evidence: [evidenceSchema]
});

const inspectionSchema = new mongoose.Schema({
  leaseId: {
    type: Number,
    required: true,
    index: true
  },
  inspectionType: {
    type: String,
    enum: ["move_in", "move_out"],
    required: true
  },
  inspectedBy: {
    type: Number,
    required: true
  },
  rooms: [roomSchema],
  tenantAcknowledged: {
    type: Boolean,
    default: false
  },
  landlordAcknowledged: {
    type: Boolean,
    default: false
  },
  inspectionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Inspection", inspectionSchema);
