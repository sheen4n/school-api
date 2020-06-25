const express = require('express');
const error = require('../middleware/error');

const commonstudents = require('../routes/commonstudents');
const retrievefornotifications = require('../routes/retrievefornotifications');
const register = require('../routes/register');
const suspend = require('../routes/suspend');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/commonstudents', commonstudents);
  app.use('/api/retrievefornotifications', retrievefornotifications);
  app.use('/api/register', register);
  app.use('/api/suspend', suspend);
  app.use(error);
};
