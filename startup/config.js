const config = require('config');

module.exports = function () {
  if (!config.get('port')) {
    console.error('Fatal Error: SCHOOL_API_PORT is not defined.');
    throw new Error('Fatal Error:SCHOOL_API_PORT is not defined.');
  }
};
