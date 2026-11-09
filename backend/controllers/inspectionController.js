
const Inspection = require("../models/Inspection");

// Create a new inspection
const createInspection = async (req, res) => {
  try {
    const {
      leaseId,
      inspectionType,
      inspectedBy,
      rooms
    } = req.body;

    // Basic validation
    if (
      !leaseId ||
      !inspectionType ||
      !inspectedBy ||
      !Array.isArray(rooms) ||
      rooms.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required inspection details."
      });
    }

    const inspection = new Inspection({
      leaseId,
      inspectionType,
      inspectedBy,
      rooms
    });

    const savedInspection = await inspection.save();

    res.status(201).json({
      success: true,
      message: "Inspection created successfully!",
      data: savedInspection
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all inspections
const getInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find().sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: inspections.length,
      data: inspections
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createInspection,
  getInspections
};
