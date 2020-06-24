// Ensure Schema Is Created Beforehand

const db = require('../models');
db.sequelize.sync({ force: true });
