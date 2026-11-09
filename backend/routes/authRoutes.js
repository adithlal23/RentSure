
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../controllers/authController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route: Any logged-in user
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated user details",
    user: req.user
  });
});

// Landlord-only test route
router.get(
  "/landlord-test",
  protect,
  authorizeRoles("landlord"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome, landlord! Access granted."
    });
  }
);

module.exports = router;
