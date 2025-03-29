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
          attributes: ["id", "title", "author", "category", "image"],
        },
      ],
    });

    // Get monthly loan statistics for the current year
    const currentYear = new Date().getFullYear();
    let monthlyLoanStats = [];

    try {
      // Using SQLite-compatible date functions (strftime)
      monthlyLoanStats = await Loan.findAll({
        attributes: [
          [sequelize.fn("strftime", "%m", sequelize.col("borrowDate")), "month"],
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        where: sequelize.where(
          sequelize.fn("strftime", "%Y", sequelize.col("borrowDate")),
          currentYear.toString()
        ),
        group: [sequelize.fn("strftime", "%m", sequelize.col("borrowDate"))],
        order: [[sequelize.literal("month"), "ASC"]],
      });
    } catch (error) {
      console.error("Error getting monthly loan stats:", error);
      // Provide empty array if there's an error
      monthlyLoanStats = [];
    }

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
    res.status(500).json({
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
          attributes: ["id", "title", "author", "category", "isbn", "image"],
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
    res.status(500).json({
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

    // Get monthly user registration stats for the current year with SQLite-compatible functions
    let monthlyUserActivity = [];
    try {
      const currentYear = new Date().getFullYear();
      monthlyUserActivity = await User.findAll({
        attributes: [
          [sequelize.fn("strftime", "%m", sequelize.col("createdAt")), "month"],
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        where: sequelize.where(
          sequelize.fn("strftime", "%Y", sequelize.col("createdAt")),
          currentYear.toString()
        ),
        group: [sequelize.fn("strftime", "%m", sequelize.col("createdAt"))],
        order: [[sequelize.literal("month"), "ASC"]],
      });
    } catch (error) {
      console.error("Error getting monthly user stats:", error);
      monthlyUserActivity = [];
    }

    // Count users with overdue books
    const usersWithOverdueBooks = await User.count({
      include: [
        {
          model: Loan,
          where: { status: "overdue" },
          required: true,
        },
      ],
      distinct: true,
    });

    // Get most active user
    const mostActiveUser = mostActiveUsers.length > 0 
      ? {
          id: mostActiveUsers[0].User.id,
          name: mostActiveUsers[0].User.name,
          email: mostActiveUsers[0].User.email,
          loanCount: mostActiveUsers[0].dataValues.loanCount
        }
      : null;

    // Count active users (those who have borrowed at least one book)
    const activeUsers = await User.count({
      include: [
        {
          model: Loan,
          required: true,
        },
      ],
      distinct: true,
    });

    res.status(200).json({
      usersByRole,
      mostActiveUsers,
      usersWithOverdueLoans,
      newUsers,
      monthlyUserActivity,
      usersWithOverdueBooks,
      mostActiveUser,
      activeUsers
    });
  } catch (error) {
    console.error("User stats error:", error);
    res.status(500).json({
      message: "Error retrieving user statistics",
      error: error.message,
    });
  }
};

// Get dashboard statistics for a specific user
exports.getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    // Get user's active loans
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
          attributes: ["id", "title", "author", "category", "isbn", "image"],
        },
      ],
      order: [["borrowDate", "DESC"]],
    });

    // Get user's overdue books
    const overdueLoans = activeLoans.filter(
      (loan) => loan.status === "overdue"
    );

    // Get user's loan history (completed loans)
    const completedLoans = await Loan.count({
      where: {
        userId,
        status: "returned",
      },
    });

    // Get user's pending reservations
    const pendingReservations = await Reservation.count({
      where: {
        userId,
        status: "pending",
      },
    });

    // Calculate user statistics
    const userStats = {
      activeBorrows: activeLoans.length,
      overdue: overdueLoans.length,
      returned: completedLoans,
      totalActivity: activeLoans.length + completedLoans,
      pendingReservations,
      recentLoans: activeLoans
        .map((loan) => ({
          id: loan.id,
          bookId: loan.bookId,
          bookTitle: loan.Book.title,
          bookAuthor: loan.Book.author,
          bookCategory: loan.Book.category,
          bookImage: loan.Book.image,
          borrowDate: loan.borrowDate,
          dueDate: loan.dueDate,
          status: loan.status,
        }))
        .slice(0, 5), // Return only 5 most recent loans
    };

    res.status(200).json(userStats);
  } catch (error) {
    console.error("Error getting user dashboard stats:", error);
    res
      .status(500)
      .json({ message: "Error retrieving user dashboard statistics" });
  }
};
