const express = require("express");
const { body } = require("express-validator");
const reservationController = require("../controllers/reservation.controller");
const {
  verifyToken,
  isStaffOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

// Get all reservations (protected route - staff or admin only)
router.get(
  "/",
  verifyToken,
  isStaffOrAdmin,
  reservationController.getAllReservations
);

// Get reservation by ID (protected route)
router.get("/:id", verifyToken, reservationController.getReservationById);

// Create a new reservation (protected route)
router.post(
  "/",
  verifyToken,
  [
    body("bookId").isInt().withMessage("Valid book ID is required"),
    body("userId").optional().isInt().withMessage("Valid user ID is required"),
  ],
  reservationController.createReservation
);

// Cancel a reservation (protected route)
router.put("/:id/cancel", verifyToken, reservationController.cancelReservation);

// Check for expired reservations (protected route - staff or admin only)
router.get(
  "/check-expired",
  verifyToken,
  isStaffOrAdmin,
  reservationController.checkExpiredReservations
);

// Get user's active reservations (protected route)
router.get(
  "/user/:userId?",
  verifyToken,
  reservationController.getUserActiveReservations
);

module.exports = router;
