const db = require('../models');

const dbInit = () =>
  db.sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
      throw new Error(err);
    });

module.exports = dbInit;
