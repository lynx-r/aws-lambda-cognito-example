import fs = require('fs');
import events = require('events');
import Logger = require("bunyan");
import setupPassport = require("./config/passport");
import helmet = require("helmet");
import passport = require("passport");
import * as restify from "restify";

import './ioc/loader';
import {ServerBase} from "./server-base";
import {InversifyRestifyServer} from "inversify-restify-utils";
import {container} from "./ioc/ioc";
import {AppConstants} from "./constant/app-constants";
import {nconf} from "./config/config";
import {Server} from "restify";
import awsServerlessExpress = require('aws-serverless-express');
import awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
import * as express from "express";
import * as _ from "lodash";
/**
 * The server.
 *
 * @class Server
 */
export class ServerLambda extends ServerBase {
  private server: Server;

  bootstrap() {
    // console.log(express());
    const r = restify.createServer();
    super.bootstrap();
    //create restify application
    this.app = new InversifyRestifyServer(container, {
      name: AppConstants.APP_NAME,
      version: nconf.get("server:api_version"),
      log: this.logger
    }).setConfig((app) => {
      this.config(app);
      this.configPassport(app);
      this.configLambda(app);
    }).build();
    // this.configLambda(r);
    // return this.app;
  }

  private configLambda(app) {
    app.use(awsServerlessExpressMiddleware.eventContext());
    this.server = awsServerlessExpress.createServer(app, null, AppConstants.BINARY_MIME_TYPES);
  }

  handler(event, context) {
    awsServerlessExpress.proxy(this.server, event, context);
  }

}
