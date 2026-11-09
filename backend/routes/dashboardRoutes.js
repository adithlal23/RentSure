const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboardController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", protect, authorizeRoles("landlord"), getDashboardStats);

module.exports = router;