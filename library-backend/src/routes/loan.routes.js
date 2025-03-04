const express = require("express");
const { body } = require("express-validator");
const loanController = require("../controllers/loan.controller");
const {
  verifyToken,
  isStaffOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

// Get all loans (protected route - staff or admin only)
router.get("/", verifyToken, isStaffOrAdmin, loanController.getAllLoans);

// Get loan by ID (protected route)
router.get("/:id", verifyToken, loanController.getLoanById);

// Create a new loan (borrow a book) (protected route)
router.post(
  "/",
  verifyToken,
  [
    body("bookId").isInt().withMessage("Valid book ID is required"),
    body("userId").optional().isInt().withMessage("Valid user ID is required"),
  ],
  loanController.createLoan
);

// Return a book (protected route)
router.put("/:id/return", verifyToken, loanController.returnBook);

// Check for overdue loans (protected route - staff or admin only)
router.get(
  "/check-overdue",
  verifyToken,
  isStaffOrAdmin,
  loanController.checkOverdueLoans
);

// Get user's active loans (protected route)
router.get("/user/:userId?", verifyToken, loanController.getUserActiveLoans);

module.exports = router;
