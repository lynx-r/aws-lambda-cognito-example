import {ServerLambda} from "./server-lambda";

const server = new ServerLambda();
server.bootstrap();

exports.handler = function(event, context) {
  return server.handler(event, context);
};