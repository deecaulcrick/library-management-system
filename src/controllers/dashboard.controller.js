const { Book, User, Loan, Reservation } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalBooks = await Book.count();
    const totalUsers = await User.count();
    const totalLoans = await Loan.count();
    const totalReservations = await Reservation.count();

    // Get active loans count
    const activeLoans = await Loan.count({
      where: {
        status: {
          [Op.in]: ["borrowed", "overdue"],
        },
      },
    });

    // Get overdue loans count
    const overdueLoans = await Loan.count({
      where: {
        status: "overdue",
      },
    });

    // Get active reservations count
    const activeReservations = await Reservation.count({
      where: {
        status: "pending",
      },
    });

    // Get available books count
    const availableBooks = await Book.count({
      where: {
        availableCopies: {
          [Op.gt]: 0,
        },
      },
    });

    // Get books with no available copies
    const unavailableBooks = await Book.count({
      where: {
        availableCopies: 0,
      },
    });

    // Get user counts by role
    const usersByRole = await User.findAll({
      attributes: [
        "role",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["role"],
    });

    // Get recent loans
    const recentLoans = await Loan.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
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

    // Get popular books (most borrowed)
    const popularBooks = await Loan.findAll({
      attributes: [
        "bookId",
        [sequelize.fn("COUNT", sequelize.col("bookId")), "loanCount"],
      ],
      group: ["bookId"],
      order: [[sequelize.literal("loanCount"), "DESC"]],
      limit: 5,
      include: [
        {
          model: Book,
          attributes: ["id", "title", "author", "category"],
        },
      ],
    });

    // Get monthly loan statistics for the current year
    const currentYear = new Date().getFullYear();
    const monthlyLoanStats = await Loan.findAll({
      attributes: [
        [sequelize.fn("MONTH", sequelize.col("borrowDate")), "month"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: sequelize.where(
        sequelize.fn("YEAR", sequelize.col("borrowDate")),
        currentYear
      ),
      group: [sequelize.fn("MONTH", sequelize.col("borrowDate"))],
      order: [[sequelize.literal("month"), "ASC"]],
    });

    res.status(200).json({
      counts: {
        totalBooks,
        totalUsers,
        totalLoans,
        totalReservations,
        activeLoans,
        overdueLoans,
        activeReservations,
        availableBooks,
        unavailableBooks,
      },
      usersByRole,
      recentLoans,
      popularBooks,
      monthlyLoanStats,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res
      .status(500)
      .json({
        message: "Error retrieving dashboard statistics",
        error: error.message,
      });
  }
};

// Get book statistics
exports.getBookStats = async (req, res) => {
  try {
    // Get books by category
    const booksByCategory = await Book.findAll({
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["category"],
      order: [[sequelize.literal("count"), "DESC"]],
    });

    // Get most popular books (most borrowed)
    const popularBooks = await Loan.findAll({
      attributes: [
        "bookId",
        [sequelize.fn("COUNT", sequelize.col("bookId")), "loanCount"],
      ],
      group: ["bookId"],
      order: [[sequelize.literal("loanCount"), "DESC"]],
      limit: 10,
      include: [
        {
          model: Book,
          attributes: ["id", "title", "author", "category", "isbn"],
        },
      ],
    });

    // Get least borrowed books
    const leastBorrowedBooks = await Book.findAll({
      attributes: [
        "id",
        "title",
        "author",
        "category",
        "isbn",
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM loans WHERE loans.bookId = Book.id)"
          ),
          "loanCount",
        ],
      ],
      order: [[sequelize.literal("loanCount"), "ASC"]],
      limit: 10,
    });

    // Get books with highest availability
    const highestAvailability = await Book.findAll({
      where: {
        totalCopies: {
          [Op.gt]: 0,
        },
      },
      attributes: [
        "id",
        "title",
        "author",
        "totalCopies",
        "availableCopies",
        [
          sequelize.literal("(availableCopies / totalCopies * 100)"),
          "availabilityPercentage",
        ],
      ],
      order: [[sequelize.literal("availabilityPercentage"), "DESC"]],
      limit: 10,
    });

    // Get books with lowest availability
    const lowestAvailability = await Book.findAll({
      where: {
        totalCopies: {
          [Op.gt]: 0,
        },
      },
      attributes: [
        "id",
        "title",
        "author",
        "totalCopies",
        "availableCopies",
        [
          sequelize.literal("(availableCopies / totalCopies * 100)"),
          "availabilityPercentage",
        ],
      ],
      order: [[sequelize.literal("availabilityPercentage"), "ASC"]],
      limit: 10,
    });

    res.status(200).json({
      booksByCategory,
      popularBooks,
      leastBorrowedBooks,
      highestAvailability,
      lowestAvailability,
    });
  } catch (error) {
    console.error("Book stats error:", error);
    res
      .status(500)
      .json({
        message: "Error retrieving book statistics",
        error: error.message,
      });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    // Get users by role
    const usersByRole = await User.findAll({
      attributes: [
        "role",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["role"],
    });

    // Get most active users (most loans)
    const mostActiveUsers = await Loan.findAll({
      attributes: [
        "userId",
        [sequelize.fn("COUNT", sequelize.col("userId")), "loanCount"],
      ],
      group: ["userId"],
      order: [[sequelize.literal("loanCount"), "DESC"]],
      limit: 10,
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });

    // Get users with overdue loans
    const usersWithOverdueLoans = await User.findAll({
      include: [
        {
          model: Loan,
          where: {
            status: "overdue",
          },
          required: true,
        },
      ],
      attributes: [
        "id",
        "name",
        "email",
        "role",
        [sequelize.fn("COUNT", sequelize.col("Loans.id")), "overdueCount"],
      ],
      group: ["User.id"],
      order: [[sequelize.literal("overdueCount"), "DESC"]],
    });

    // Get new users this month
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const newUsers = await User.findAll({
      where: {
        createdAt: {
          [Op.gte]: firstDayOfMonth,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      usersByRole,
      mostActiveUsers,
      usersWithOverdueLoans,
      newUsers,
    });
  } catch (error) {
    console.error("User stats error:", error);
    res
      .status(500)
      .json({
        message: "Error retrieving user statistics",
        error: error.message,
      });
  }
};
