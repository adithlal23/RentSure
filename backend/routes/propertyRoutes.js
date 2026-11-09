
const express = require("express");
const router = express.Router();

const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} = require("../controllers/propertyController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

// All property routes require landlord authentication
router.use(protect, authorizeRoles("landlord"));

router.post("/", createProperty);
router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

module.exports = router;
