import * as restify from "restify";
import events = require('events');
import {MongoService} from "./service/mongo.service";
import Logger = require("bunyan");
import {AppConstants} from "./service/app-constants";
import fs = require('fs');
import {container} from "./inversify.config";
import {InversifyRestifyServer} from "inversify-restify-utils";

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
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this server.
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
          path: AppConstants.LOG_PATH,
          period: '1d',   // daily rotation
          count: 3        // keep 3 back copies
        }
      ]
    });
    //create expressjs application
    this.server = new InversifyRestifyServer(container, {
      name: AppConstants.APP_NAME,
      version: AppConstants.APP_VERSION,
      log: this.logger,
    }).build();
  }

  start() {
    this.mongoose();

    //configure application
    this.config();
  }

  /**
   * Create mongoose connection
   */
  private mongoose() {
    const mongoService = new MongoService();
    mongoService.connect();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    this.server.use(restify.CORS({
      origins: ['http://localhost:4200', 'http://localhost'],   // defaults to ['*']
      credentials: true,                 // defaults to false
    }));

    this.server.use(restify.queryParser());
    //use json form parser middlware
    this.server.use(restify.bodyParser());

    this.server.listen(this.getPort(), this.getHost(), () => {
      console.log('%s listening at %s', this.server.name, this.server.url);
    });
    this.server.on('error', (error) => {
      this.onError(error);
    });
    this.server.on('listening', () => {
      this.onListening();
    });
    this.server.on('uncaughtException', function (request, response, route, error) {
      console.error(error.stack);
      response.send(error);
    });
    this.server.on('after', restify.auditLogger({
      log: this.logger
    }));
  }

  getPort(): number {
    return this.normalizePort(process.env.PORT || 3000);//config.get('port');
  }

  getHost(): string {
    return 'localhost';
  }

  normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
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

  /**
   * Event listener for HTTP server "listening" event.
   */
  private onListening() {
    const addr = this.server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  }

}
