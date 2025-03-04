const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // role: {
    //   type: DataTypes.ENUM("admin", "staff", "student"),
    //   allowNull: false,
    //   defaultValue: "student",
    // },
    // status: {
    //   type: DataTypes.ENUM("active", "inactive", "suspended"),
    //   allowNull: false,
    //   defaultValue: "active",
    // },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "student",
      validate: {
        isIn: [["admin", "staff", "student"]],
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
      validate: {
        isIn: [["active", "inactive", "suspended"]],
      },
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

module.exports = User;
