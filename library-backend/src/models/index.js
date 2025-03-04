const sequelize = require("../config/database");
const User = require("./user.model");
const Book = require("./book.model");
const Loan = require("./loan.model");
const Reservation = require("./reservation.model");

// Define associations
User.hasMany(Loan, { foreignKey: "userId" });
Loan.belongsTo(User, { foreignKey: "userId" });

Book.hasMany(Loan, { foreignKey: "bookId" });
Loan.belongsTo(Book, { foreignKey: "bookId" });

User.hasMany(Reservation, { foreignKey: "userId" });
Reservation.belongsTo(User, { foreignKey: "userId" });

Book.hasMany(Reservation, { foreignKey: "bookId" });
Reservation.belongsTo(Book, { foreignKey: "bookId" });

// Function to sync all models with the database
const syncDatabase = async (force = false) => {
  try {
    // Use { force: true } only when testing since it drops all tables before recreating them.
    // { alter: true }
    await sequelize.sync({ force });
    console.log("Database synchronized successfully");

    // Create admin user if force is true (fresh database)
    if (force) {
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);

      await User.create({
        name: "Admin User",
        email: "admin@library.com",
        password: hashedPassword,
        role: "admin",
      });
    }
  } catch (error) {
    console.error("Error synchronizing database:", error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Book,
  Loan,
  Reservation,
  syncDatabase,
};
