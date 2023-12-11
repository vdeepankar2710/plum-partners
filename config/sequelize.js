const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
  });

//** To check for sequelize has been connected to the DB or not, run the below commented code*/

// sequelize
// .authenticate()
// .then(() => {
// console.log('Connected to PostgreSQL database');
// })
// .catch((error) => {
// console.error('Unable to connect to the database:', error);
// });

module.exports = {sequelize};


