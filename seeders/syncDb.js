// Ensure Schema Is Created Beforehand

const db = require('../models');
const syncDb = async () => db.sequelize.sync({ force: true });

syncDb();

module.exports = syncDb;
