const { Sequelize } = require("sequelize");
const config = require("./config");

// const sequelize = new Sequelize(
//   config.db.database,
//   config.db.user,
//   config.db.password,
//   {
//     host: config.db.host,
//     port: config.db.port,
//     dialect: "mysql",
//     logging: config.nodeEnv === "development" ? console.log : false,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//   }
// );

// Use SQLite instead of MySQL for WebContainer compatibility
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: config.nodeEnv === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
