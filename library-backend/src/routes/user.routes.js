const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const {
  verifyToken,
  isAdmin,
  isOwnerOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

// Get all users (protected route - admin only)
router.get("/", verifyToken, isAdmin, userController.getAllUsers);

// Get user by ID (protected route - owner or admin)
router.get(
  "/:id",
  verifyToken,
  isOwnerOrAdmin("id"),
  userController.getUserById
);

// Update user (protected route - owner or admin)
router.put(
  "/:id",
  verifyToken,
  isOwnerOrAdmin("id"),
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please provide a valid email"),
    body("role").optional(),
  ],
  userController.updateUser
);

// Delete user (protected route - admin only)
router.delete("/:id", verifyToken, isAdmin, userController.deleteUser);

// Get user loan history (protected route - owner or admin)
router.get(
  "/:id/loans",
  verifyToken,
  isOwnerOrAdmin("id"),
  userController.getUserLoanHistory
);

module.exports = router;
