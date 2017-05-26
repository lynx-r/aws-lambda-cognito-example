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

/**
 * The server.
 *
 * @class Server
 */
export class ServerLocal extends ServerBase{

  bootstrap(): restify.Server {
    super.bootstrap();
    //create restify application
    this.app = new InversifyRestifyServer(container, {
      name: AppConstants.APP_NAME,
      version: nconf.get("server:api_version"),
      log: this.logger
    }).setConfig((app) => {
      this.config(app);
      this.configPassport(app);
      this.listen(app);
    }).build();
    return this.app;
  }
}
