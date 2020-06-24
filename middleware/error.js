const winston = require('winston');

module.exports = function (err, req, res, next) {
  winston.error(err.message, err);
  res.status(500).send({
    message: 'Something failed on the system. Please try again later or contact the developer.',
  });
};
