const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Loan = sequelize.define(
  "Loan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "books",
        key: "id",
      },
    },
    borrowDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // status: {
    //   type: DataTypes.ENUM("borrowed", "returned", "overdue"),
    //   allowNull: false,
    //   defaultValue: "borrowed",
    // },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "borrowed",
      validate: {
        isIn: [["borrowed", "returned", "overdue"]],
      },
    },
    fineAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    finePaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "loans",
  }
);

module.exports = Loan;
