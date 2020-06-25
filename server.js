const winston = require('winston');
const express = require('express');
const config = require('config');
const app = express();

require('./startup/logging')();
require('./startup/prod')(app);
require('./startup/routes')(app);

const port = config.get('port') || process.env.PORT;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;
