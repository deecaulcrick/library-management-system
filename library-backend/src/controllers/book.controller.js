const { Op } = require("sequelize");
const { Book, Loan, User } = require("../models");
const QRCode = require("qrcode");
const { validationResult } = require("express-validator");

// Get all books with optional filtering
exports.getAllBooks = async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      available,
      page = 1,
      limit = 10,
      sortBy = "title",
      sortOrder = "ASC",
    } = req.query;

    // Build filter conditions
    const whereConditions = {};

    if (title) {
      whereConditions.title = { [Op.like]: `%${title}%` };
    }

    if (author) {
      whereConditions.author = { [Op.like]: `%${author}%` };
    }

    if (category) {
      whereConditions.category = { [Op.like]: `%${category}%` };
    }

    if (available === "true") {
      whereConditions.availableCopies = { [Op.gt]: 0 };
    } else if (available === "false") {
      whereConditions.availableCopies = { [Op.eq]: 0 };
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Validate sort parameters
    const validSortFields = [
      "title",
      "author",
      "publishedDate",
      "availableCopies",
      "createdAt",
    ];
    const validSortOrders = ["ASC", "DESC"];

    const orderBy = validSortFields.includes(sortBy) ? sortBy : "title";
    const orderDirection = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder
      : "ASC";

    // Get books with pagination
    const { count, rows: books } = await Book.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[orderBy, orderDirection]],
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      books,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get all books error:", error);
    res
      .status(500)
      .json({ message: "Error retrieving books", error: error.message });
  }
};

// Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Generate QR code for the book
    const bookUrl = `${req.protocol}://${req.get("host")}/api/books/${book.id}`;
    const qrCode = await QRCode.toDataURL(bookUrl);

    res.status(200).json({
      book,
      qrCode,
    });
  } catch (error) {
    console.error("Get book by ID error:", error);
    res
      .status(500)
      .json({ message: "Error retrieving book", error: error.message });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      author,
      isbn,
      category,
      description,
      publishedDate,
      publisher,
      totalCopies,
      shelfLocation,
    } = req.body;

    // Check if book with same ISBN already exists
    const existingBook = await Book.findOne({ where: { isbn } });
    if (existingBook) {
      return res
        .status(400)
        .json({ message: "Book with this ISBN already exists" });
    }

    // Create new book
    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      description,
      publishedDate,
      publisher,
      totalCopies: totalCopies || 1,
      availableCopies: totalCopies || 1,
      shelfLocation,
    });

    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.error("Create book error:", error);
    res
      .status(500)
      .json({ message: "Error creating book", error: error.message });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Find book
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const {
      title,
      author,
      isbn,
      category,
      description,
      publishedDate,
      publisher,
      totalCopies,
      shelfLocation,
    } = req.body;

    // Check if updating ISBN and if it already exists
    if (isbn && isbn !== book.isbn) {
      const existingBook = await Book.findOne({ where: { isbn } });
      if (existingBook) {
        return res
          .status(400)
          .json({ message: "Book with this ISBN already exists" });
      }
    }

    // Calculate available copies if total copies is updated
    let availableCopies = book.availableCopies;
    if (totalCopies !== undefined) {
      const loanedCopies = book.totalCopies - book.availableCopies;
      availableCopies = Math.max(0, totalCopies - loanedCopies);
    }

    // Update book
    await book.update({
      title: title || book.title,
      author: author || book.author,
      isbn: isbn || book.isbn,
      category: category || book.category,
      description: description || book.description,
      publishedDate: publishedDate || book.publishedDate,
      publisher: publisher || book.publisher,
      totalCopies: totalCopies || book.totalCopies,
      availableCopies: availableCopies,
      shelfLocation: shelfLocation || book.shelfLocation,
    });

    res.status(200).json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error("Update book error:", error);
    res
      .status(500)
      .json({ message: "Error updating book", error: error.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Find book
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if book has active loans
    const activeLoans = await Loan.count({
      where: {
        bookId,
        status: {
          [Op.in]: ["borrowed", "overdue"],
        },
      },
    });

    if (activeLoans > 0) {
      return res.status(400).json({
        message: "Cannot delete book with active loans",
        activeLoans,
      });
    }

    // Delete book
    await book.destroy();

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete book error:", error);
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
};

// Get book loan history
exports.getBookLoanHistory = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Find book
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Get loan history
    const loans = await Loan.findAll({
      where: { bookId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["borrowDate", "DESC"]],
    });

    res.status(200).json({ loans });
  } catch (error) {
    console.error("Get book loan history error:", error);
    res.status(500).json({
      message: "Error retrieving book loan history",
      error: error.message,
    });
  }
};
