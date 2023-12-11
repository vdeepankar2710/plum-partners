const dbConfig = require("../config/dbConfig");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
      host: dbConfig.HOST,
      dialect: dbConfig.dialect,
      operatorsAliases: false,
      quoteIdentifiers: false,
      pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
      },
      logging: false
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

/*
  add all the model files here, to connect with the db
*/

db.coupon = require("./coupon")(sequelize, Sequelize);
db.user = require("./user")(sequelize, Sequelize);
db.userCoupon = require("./userCoupon")(sequelize, Sequelize);
db.repeatCount = require("./repeatCount")(sequelize, Sequelize);

module.exports = db;