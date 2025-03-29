const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const {
  verifyToken,
  isAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

// Admin dashboard routes - protected with admin verification
router.get("/admin/stats", verifyToken, isAdmin, dashboardController.getDashboardStats);
router.get("/admin/books", verifyToken, isAdmin, dashboardController.getBookStats);
router.get("/admin/users", verifyToken, isAdmin, dashboardController.getUserStats);

// User dashboard route - any authenticated user can access their own stats
router.get(
  "/user/:userId?",
  verifyToken,
  dashboardController.getUserDashboardStats
);

module.exports = router;
