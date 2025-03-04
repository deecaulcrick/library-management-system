const { validationResult } = require("express-validator");
const { Reservation, Book, User } = require("../models");
const { Op } = require("sequelize");
const emailService = require("../utils/email");

// Helper function to calculate expiry date (7 days from now)
const calculateExpiryDate = () => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  return expiryDate;
};

// Get all reservations with optional filtering
exports.getAllReservations = async (req, res) => {
  try {
    const {
      status,
      userId,
      bookId,
      page = 1,
      limit = 10,
      sortBy = "reservationDate",
      sortOrder = "DESC",
    } = req.query;

    // Build filter conditions
    const whereConditions = {};

    if (status) {
      whereConditions.status = status;
    }

    if (userId) {
      whereConditions.userId = userId;
    }

    if (bookId) {
      whereConditions.bookId = bookId;
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Validate sort parameters
    const validSortFields = ["reservationDate", "expiryDate", "createdAt"];
    const validSortOrders = ["ASC", "DESC"];

    const orderBy = validSortFields.includes(sortBy)
      ? sortBy
      : "reservationDate";
    const orderDirection = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder
      : "DESC";

    // Get reservations with pagination
    const { count, rows: reservations } = await Reservation.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Book,
          attributes: ["id", "title", "author", "isbn"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[orderBy, orderDirection]],
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      reservations,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get all reservations error:", error);
    res
      .status(500)
      .json({ message: "Error retrieving reservations", error: error.message });
  }
};

// Get reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const reservationId = req.params.id;

    const reservation = await Reservation.findByPk(reservationId, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Book,
          attributes: ["id", "title", "author", "isbn"],
        },
      ],
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ reservation });
  } catch (error) {
    console.error("Get reservation by ID error:", error);
    res
      .status(500)
      .json({ message: "Error retrieving reservation", error: error.message });
  }
};

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookId, userId } = req.body;

    // If userId is not provided, use the authenticated user's ID
    const reserverId = userId || req.user.id;

    // Check if user exists
    const user = await User.findByPk(reserverId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if book is already available
    if (book.availableCopies > 0) {
      return res.status(400).json({
        message: "Book is currently available. No need to reserve.",
        availableCopies: book.availableCopies,
      });
    }

    // Check if user already has an active reservation for this book
    const existingReservation = await Reservation.findOne({
      where: {
        userId: reserverId,
        bookId,
        status: "pending",
      },
    });

    if (existingReservation) {
      return res.status(400).json({
        message: "User already has an active reservation for this book",
        reservation: existingReservation,
      });
    }

    // Calculate expiry date (7 days from now)
    const expiryDate = calculateExpiryDate();

    // Create new reservation
    const reservation = await Reservation.create({
      userId: reserverId,
      bookId,
      reservationDate: new Date(),
      status: "pending",
      expiryDate,
    });

    // Return reservation with related data
    const reservationWithRelations = await Reservation.findByPk(
      reservation.id,
      {
        include: [
          {
            model: User,
            attributes: ["id", "name", "email", "role"],
          },
          {
            model: Book,
            attributes: ["id", "title", "author", "isbn"],
          },
        ],
      }
    );

    res.status(201).json({
      message: "Book reserved successfully",
      reservation: reservationWithRelations,
    });
  } catch (error) {
    console.error("Create reservation error:", error);
    res
      .status(500)
      .json({ message: "Error reserving book", error: error.message });
  }
};

// Cancel a reservation
exports.cancelReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;

    const reservation = await Reservation.findByPk(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status !== "pending") {
      return res.status(400).json({
        message: `Reservation cannot be cancelled. Current status: ${reservation.status}`,
      });
    }

    // Check if user is authorized to cancel this reservation
    if (req.user.role !== "admin" && req.user.id !== reservation.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to cancel this reservation" });
    }

    // Update reservation status
    reservation.status = "cancelled";
    await reservation.save();

    // Return updated reservation with related data
    const updatedReservation = await Reservation.findByPk(reservationId, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Book,
          attributes: ["id", "title", "author", "isbn"],
        },
      ],
    });

    res.status(200).json({
      message: "Reservation cancelled successfully",
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error("Cancel reservation error:", error);
    res
      .status(500)
      .json({ message: "Error cancelling reservation", error: error.message });
  }
};

// Check for expired reservations and update status
exports.checkExpiredReservations = async (req, res) => {
  try {
    // Find all pending reservations with expiry date in the past
    const expiredReservations = await Reservation.findAll({
      where: {
        status: "pending",
        expiryDate: { [Op.lt]: new Date() },
      },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
        {
          model: Book,
          attributes: ["id", "title", "author"],
        },
      ],
    });

    // Update status to cancelled
    const updatedReservations = [];
    for (const reservation of expiredReservations) {
      reservation.status = "expired";
      await reservation.save();
      updatedReservations.push(reservation);

      // Send notification to the user
      await emailService.sendReservationExpiredEmail(
        reservation.User.email,
        reservation.User.name,
        reservation.Book.title
      );
    }

    res.status(200).json({
      message: `${updatedReservations.length} reservations marked as expired`,
      expiredReservations: updatedReservations,
    });
  } catch (error) {
    console.error("Check expired reservations error:", error);
    res.status(500).json({
      message: "Error checking expired reservations",
      error: error.message,
    });
  }
};

// Get user's active reservations
exports.getUserActiveReservations = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    const activeReservations = await Reservation.findAll({
      where: {
        userId,
        status: "pending",
      },
      include: [
        {
          model: Book,
          attributes: ["id", "title", "author", "isbn", "category"],
        },
      ],
      order: [["reservationDate", "DESC"]],
    });

    res.status(200).json({ activeReservations });
  } catch (error) {
    console.error("Get user active reservations error:", error);
    res.status(500).json({
      message: "Error retrieving active reservations",
      error: error.message,
    });
  }
};
