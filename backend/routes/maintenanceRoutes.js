const express = require("express");
const router = express.Router();

const {
  createMaintenance,
  getMaintenance,
  updateMaintenance
} = require("../controllers/maintenanceController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", authorizeRoles("landlord", "tenant"), createMaintenance);
router.get("/", authorizeRoles("landlord", "tenant"), getMaintenance);
router.patch("/:id", authorizeRoles("landlord"), updateMaintenance);

module.exports = router;