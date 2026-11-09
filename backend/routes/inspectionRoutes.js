
const express = require("express");
const router = express.Router();

const {
  createInspection,
  getInspections
} = require("../controllers/inspectionController");

// POST: Create inspection
router.post("/", createInspection);

// GET: Retrieve all inspections
router.get("/", getInspections);

module.exports = router;
