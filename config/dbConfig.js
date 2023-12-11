const config = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "postgres",
    DB: "coupon_code_db",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
  };
  
  module.exports = config