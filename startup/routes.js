const express = require('express');
const error = require('../middleware/error');

const register = require('../routes/register');
const commonstudents = require('../routes/commonstudents');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/register', register);
  app.use('/api/commonstudents', commonstudents);
  app.use(error);
};
