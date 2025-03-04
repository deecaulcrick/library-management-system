const { validationResult } = require("express-validator");
const { User, Loan, Book } = require("../models");
const { Op } = require("sequelize");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const {
      role,
      search,
      page = 1,
      limit = 10,
      sortBy = "name",
      sortOrder = "ASC",
    } = req.query;

    // Build filter conditions
    const whereConditions = {};

    if (role) {
      whereConditions.role = role;
    }

    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Validate sort parameters
    const validSortFields = ["name", "email", "role", "createdAt"];
    const validSortOrders = ["ASC", "DESC"];

    const orderBy = validSortFields.includes(sortBy) ? sortBy : "name";
    const orderDirection = validSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder
      : "ASC";

    // Get users with pagination
    const { count, rows: users } = await User.findAndCountAll({
      where: whereConditions,
      attributes: { exclude: ["password"] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[orderBy, orderDirection]],
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      users,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res
      .status(500)
      .json({ message: "Error retrieving users", error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.id;
    const { name, email, role } = req.body;

    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if updating email and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Only admin can change roles
    if (role && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can change user roles" });
    }

    // Update user
    await user.update({
      name: name || user.name,
      email: email || user.email,
      role: role || user.role,
    });

    // Return user without password
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has active loans
    const activeLoans = await Loan.count({
      where: {
        userId,
        status: {
          [Op.in]: ["borrowed", "overdue"],
        },
      },
    });

    if (activeLoans > 0) {
      return res.status(400).json({
        message: "Cannot delete user with active loans",
        activeLoans,
      });
    }

    // Delete user
    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// Get user loan history
exports.getUserLoanHistory = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get loan history
    const loans = await Loan.findAll({
      where: { userId },
      include: [
        {
          model: Book,
          attributes: ["id", "title", "author", "isbn", "category"],
        },
      ],
      order: [["borrowDate", "DESC"]],
    });

    res.status(200).json({ loans });
  } catch (error) {
    console.error("Get user loan history error:", error);
    res
      .status(500)
      .json({
        message: "Error retrieving user loan history",
        error: error.message,
      });
  }
};
