const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  timezone: '+07:00'
});

users = require("./user.model")(sequelize, DataTypes)
books = require("./book.model")(sequelize, DataTypes)
tokens = require("./token.model")(sequelize, DataTypes)

users.hasMany(books)
books.hasMany(tokens)

const db = {
  users,
  books,
  tokens
};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;