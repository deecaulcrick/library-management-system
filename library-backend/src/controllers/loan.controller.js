const { validationResult } = require("express-validator");
const { Loan, Book, User, Reservation } = require("../models");
const { Op } = require("sequelize");
const emailService = require("../utils/email");

// Helper function to calculate due date based on user role
const calculateDueDate = (userRole) => {
  const dueDate = new Date();

  // Set loan duration based on user role
  if (userRole === "student") {
    dueDate.setDate(dueDate.getDate() + 14); // 14 days for students
  } else {
    dueDate.setDate(dueDate.getDate() + 30); // 30 days for staff and admin
  }

  return dueDate;
};

// Get all loans with optional filtering
exports.getAllLoans = async (req, res) => {
  try {
    const {
      status,
      userId,
      bookId,
      page = 1,
      limit = 10,
      sortBy = "borrowDate",
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
    const validSortFields = [
      "borrowDate",
      "dueDate",
      "returnDate",
      "createdAt",
    ];
    const validSortOrders = ["ASC", "DESC"];

    const orderBy = validSortFields.includes(sortBy) ? sortBy : "borrowDate";
    const orderDirection = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder
      : "DESC";

    // Get loans with pagination
    const { count, rows: loans } = await Loan.findAndCountAll({
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
      loans,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get all loans error:", error);
    res
      .status(500)
      .json({ message: "Error retrieving loans", error: error.message });
  }
};

// Get loan by ID
exports.getLoanById = async (req, res) => {
  try {
    const loanId = req.params.id;

    const loan = await Loan.findByPk(loanId, {
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

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Check if user is authorized to view this loan
    if (
      req.user.role !== "admin" &&
      req.user.role !== "staff" &&
      req.user.id !== loan.userId
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to view this loan" });
    }

    res.status(200).json({ loan });
  } catch (error) {
    console.error("Get loan by ID error:", error);
    res
      .status(500)
      .json({ message: "Error retrieving loan", error: error.message });
  }
};

// Create a new loan (borrow a book)
exports.createLoan = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookId, userId } = req.body;

    // If userId is not provided, use the authenticated user's ID
    const borrowerId = userId || req.user.id;

    // Check if user exists
    const user = await User.findByPk(borrowerId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if book is available
    if (book.availableCopies <= 0) {
      return res
        .status(400)
        .json({ message: "Book is not available for borrowing" });
    }

    // Check if user already has an active loan for this book
    const existingLoan = await Loan.findOne({
      where: {
        userId: borrowerId,
        bookId,
        status: {
          [Op.in]: ["borrowed", "overdue"],
        },
      },
    });

    if (existingLoan) {
      return res.status(400).json({
        message: "User already has an active loan for this book",
        loan: existingLoan,
      });
    }

    // Calculate due date based on user role
    const dueDate = calculateDueDate(user.role);

    // Create new loan
    const loan = await Loan.create({
      userId: borrowerId,
      bookId,
      borrowDate: new Date(),
      dueDate,
      status: "borrowed",
    });

    // Update book available copies
    book.availableCopies -= 1;
    await book.save();

    // Check if there are pending reservations for this book
    // If this was the last available copy, we don't need to fulfill any reservations

    // Return loan with related data
    const loanWithRelations = await Loan.findByPk(loan.id, {
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

    res.status(201).json({
      message: "Book borrowed successfully",
      loan: loanWithRelations,
    });
  } catch (error) {
    console.error("Create loan error:", error);
    res
      .status(500)
      .json({ message: "Error borrowing book", error: error.message });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  try {
    const loanId = req.params.id;

    const loan = await Loan.findByPk(loanId, {
      include: [
        {
          model: Book,
        },
        {
          model: User,
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Check if loan is already returned
    if (loan.status === "returned") {
      return res.status(400).json({ message: "Book already returned" });
    }

    // Check if user is authorized to return this book
    if (
      req.user.role !== "admin" &&
      req.user.role !== "staff" &&
      req.user.id !== loan.userId
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to return this book" });
    }

    // Update loan status
    loan.status = "returned";
    loan.returnDate = new Date();
    await loan.save();

    // Update book available copies
    const book = loan.Book;
    book.availableCopies += 1;
    await book.save();

    // Check for pending reservations for this book
    const pendingReservation = await Reservation.findOne({
      where: {
        bookId: book.id,
        status: "pending",
      },
      order: [["reservationDate", "ASC"]],
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // If there's a pending reservation, notify the user
    if (pendingReservation) {
      pendingReservation.status = "fulfilled";
      await pendingReservation.save();

      // Send email notification
      await emailService.sendReservationFulfilledEmail(
        pendingReservation.User.email,
        pendingReservation.User.name,
        book.title
      );
    }

    res.status(200).json({
      message: "Book returned successfully",
      loan,
    });
  } catch (error) {
    console.error("Return book error:", error);
    res
      .status(500)
      .json({ message: "Error returning book", error: error.message });
  }
};

// Check for overdue loans and update status
exports.checkOverdueLoans = async (req, res) => {
  try {
    // Find all borrowed loans with due date in the past
    const overdueLoans = await Loan.findAll({
      where: {
        status: "borrowed",
        dueDate: { [Op.lt]: new Date() },
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

    // Update status to overdue
    const updatedLoans = [];
    for (const loan of overdueLoans) {
      loan.status = "overdue";
      await loan.save();
      updatedLoans.push(loan);

      // Send notification to the user
      await emailService.sendOverdueNotification(
        loan.User.email,
        loan.User.name,
        loan.Book.title,
        loan.dueDate
      );
    }

    res.status(200).json({
      message: `${updatedLoans.length} loans marked as overdue`,
      overdueLoans: updatedLoans,
    });
  } catch (error) {
    console.error("Check overdue loans error:", error);
    res
      .status(500)
      .json({ message: "Error checking overdue loans", error: error.message });
  }
};

// Get user's active loans
exports.getUserActiveLoans = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    // Check if user is authorized to view these loans
    if (
      req.user.role !== "admin" &&
      req.user.role !== "staff" &&
      req.user.id !== parseInt(userId)
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to view these loans" });
    }

    const activeLoans = await Loan.findAll({
      where: {
        userId,
        status: {
          [Op.in]: ["borrowed", "overdue"],
        },
      },
      include: [
        {
          model: Book,
          attributes: ["id", "title", "author", "isbn", "category"],
        },
      ],
      order: [["borrowDate", "DESC"]],
    });

    res.status(200).json({ activeLoans });
  } catch (error) {
    console.error("Get user active loans error:", error);
    res
      .status(500)
      .json({ message: "Error retrieving active loans", error: error.message });
  }
};
