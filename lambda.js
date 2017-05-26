'use strict'
const lambda = require('./dist/server-lambda')
const server = new lambda.ServerLambda();
server.bootstrap();

module.exports = server;