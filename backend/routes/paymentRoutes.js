const express = require("express");
const router = express.Router();

const {
  createPayment,
  getPayments,
  getOverduePayments,
  updatePaymentStatus
} = require("../controllers/paymentController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", authorizeRoles("landlord"), createPayment);
router.get("/", authorizeRoles("landlord", "tenant"), getPayments);
router.get("/overdue", authorizeRoles("landlord", "tenant"), getOverduePayments);
router.patch("/:id/status", authorizeRoles("landlord"), updatePaymentStatus);

module.exports = router;