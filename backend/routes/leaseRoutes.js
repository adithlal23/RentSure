const express = require("express");
const router = express.Router();

const {
  createLease,
  getLeases,
  getLeaseById,
  updateLease
} = require("../controllers/leaseController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", authorizeRoles("landlord"), createLease);
router.get("/", authorizeRoles("landlord", "tenant"), getLeases);
router.get("/:id", authorizeRoles("landlord", "tenant"), getLeaseById);
router.put("/:id", authorizeRoles("landlord"), updateLease);

module.exports = router;