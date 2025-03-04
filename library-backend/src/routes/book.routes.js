const express = require("express");
const { body } = require("express-validator");
const bookController = require("../controllers/book.controller");
const {
  verifyToken,
  isStaffOrAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

// Get all books (public route)
router.get("/", bookController.getAllBooks);

// Get book by ID (public route)
router.get("/:id", bookController.getBookById);

// Create a new book (protected route - staff or admin only)
router.post(
  "/",
  verifyToken,
  isStaffOrAdmin,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("author").notEmpty().withMessage("Author is required"),
    body("isbn").notEmpty().withMessage("ISBN is required"),
    body("category").optional(),
    body("description").optional(),
    body("publishedDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid date format"),
    body("publisher").optional(),
    body("totalCopies")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Total copies must be at least 1"),
    body("shelfLocation").optional(),
  ],
  bookController.createBook
);

// Update a book (protected route - staff or admin only)
router.put("/:id", verifyToken, isStaffOrAdmin, bookController.updateBook);

// Delete a book (protected route - staff or admin only)
router.delete("/:id", verifyToken, isStaffOrAdmin, bookController.deleteBook);

// Get book loan history (protected route - staff or admin only)
router.get(
  "/:id/loans",
  verifyToken,
  isStaffOrAdmin,
  bookController.getBookLoanHistory
);

module.exports = router;
