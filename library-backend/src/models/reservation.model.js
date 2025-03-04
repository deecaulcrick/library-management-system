const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Helper function to calculate expiry date (7 days from now)
const calculateExpiryDate = () => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  return expiryDate;
};

const Reservation = sequelize.define(
  "Reservation",
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
    reservationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: calculateExpiryDate,
    },
    // status: {
    //   type: DataTypes.ENUM("pending", "fulfilled", "cancelled", "expired"),
    //   allowNull: false,
    //   defaultValue: "pending",
    // },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "fulfilled", "cancelled", "expired"]],
      },
    },
  },
  {
    timestamps: true,
    tableName: "reservations",
  }
);

module.exports = Reservation;
