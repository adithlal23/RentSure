const express = require("express");
const router = express.Router();

const {
  createDeposit,
  getDeposits,
  settleDeposit
} = require("../controllers/depositController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", authorizeRoles("landlord"), createDeposit);
router.get("/", authorizeRoles("landlord", "tenant"), getDeposits);
router.put("/:id/settle", authorizeRoles("landlord"), settleDeposit);

module.exports = router;