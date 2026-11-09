const express = require("express");
const router = express.Router();

const {
  generateInspectionReport,
  generateDepositReport
} = require("../controllers/reportController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.use(protect, authorizeRoles("landlord"));

router.get("/inspection/:id", generateInspectionReport);
router.get("/deposit/:id", generateDepositReport);

module.exports = router;