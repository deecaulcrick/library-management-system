const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const {
  verifyToken,
  isStaffOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

// All dashboard routes are protected for staff and admin only
router.use(verifyToken, isStaffOrAdmin);

// Get dashboard statistics
router.get("/stats", dashboardController.getDashboardStats);

// Get book statistics
router.get("/books", dashboardController.getBookStats);

// Get user statistics
router.get("/users", dashboardController.getUserStats);

module.exports = router;
