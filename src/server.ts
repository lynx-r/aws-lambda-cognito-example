import * as restify from "restify";
import * as mongoose from "mongoose";
import fs = require('fs');
import events = require('events');
import Logger = require("bunyan");
import {AppConstants} from "./service/app-constants";
import {container} from "./di/inversify.config";
import {nconf} from "./config/config";
import {InversifyRestifyServer} from "inversify-restify-utils";
import {log} from "util";
import setupPassport = require("./config/passport");
import * as passport from "passport";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public server: restify.Server;
  private logger: Logger;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {Server} Returns the newly created injector for this server.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    this.logger = Logger.createLogger({
      name: AppConstants.APP_NAME,
      streams: [
        {
          level: 'info',
          stream: process.stdout
        }, {
          level: 'info',
          type: 'rotating-file',
          path: nconf.get("logger:path"),
          period: '1d',   // daily rotation
          count: 3        // keep 3 back copies
        }
      ]
    });
    let customHeaderName = "custom-header-name";
    let customHeaderValue = "custom-header-value";

    //create expressjs application
    this.server = new InversifyRestifyServer(container, {
      name: AppConstants.APP_NAME,
      version: nconf.get("server:api_version"),
      log: this.logger,
      formatters: {
        "application/json": function formatFoo(req: restify.Request, res: restify.Response, body: any, cb: any) {
          res.setHeader(customHeaderName, customHeaderValue);
          return cb();
        }
      }
    }).build();
  }

  /**
   * Configure and start listening
   */
  listen() {
    // connect to mongodb
    this.mongoose();

    //configure application
    this.config();
  }

  /**
   * Create mongoose connection
   */
  private mongoose() {
    let uri = nconf.get('database:uri');
    mongoose.connect(uri, (err) => {
      if (err) {
        log(err.message);
      } else {
        log('Connected to MongoDb');
      }
    });
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    // configure cors
    this.server.use(restify.CORS({
      origins: nconf.get("server:origins"),   // defaults to ['*']
      credentials: false,                 // defaults to false
    }));

    // to get query params in req.query
    // this.server.use(restify.queryParser());
    this.server.use(restify.acceptParser(this.server.acceptable));
    // to get passed json in req.body
    this.server.use(restify.bodyParser());

    setupPassport(passport);

    this.server.post('/test', (req, res, next) => {
      console.log(req.body);
      next();
    });

    // start listening
    this.server.listen(this.getPort(), this.getHost(), () => {
      console.log('%s listening at %s', this.server.name, this.server.url);
    });
    // error handler
    this.server.on('error', (error) => {
      this.onError(error);
    });
    // process exceptions
    this.server.on('uncaughtException', function (request, response, route, error) {
      console.error(error.stack);
      response.send(error);
    });
    // audit logger
    this.server.on('after', restify.auditLogger({
      log: this.logger
    }));
  }

  /**
   * get port from env or config.json
   * @returns {number}
   */
  getPort(): number {
    return this.normalizePort(process.env.PORT || nconf.get("server:port") || 3000);
  }

  /**
   * get host from env or config.json
   * @returns {string}
   */
  getHost(): string {
    return process.env.HOST || nconf.get("server:host") || 'localhost';
  }

  /**
   * validate port
   * @param val
   * @returns {number}
   */
  normalizePort(val): number {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    throw 'Invalid port';
  }

  /**
   * Event listener for HTTP server "error" event.
   */
  private onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof this.getPort() === 'string'
      ? 'Pipe ' + this.getPort()
      : 'Port ' + this.getPort();

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

}
