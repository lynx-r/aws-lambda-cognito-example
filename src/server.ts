// import * as bodyParser from "body-parser";
// import * as cookieParser from "cookie-parser";
import * as restify from "restify";
import events = require('events');
import {MongoService} from "./service/mongo.service";
import Logger = require("bunyan");
import {AppConstants} from "./service/app-constants";
import fs = require('fs');

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public server: restify.Server;
  // public listener: SocketService;
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
      streams: [{
        type: 'rotating-file',
        path: AppConstants.LOG_PATH,
        period: '1d',   // daily rotation
        count: 3        // keep 3 back copies
      }]
    });
    //create expressjs application
    this.server = restify.createServer({
      certificate: fs.readFileSync(AppConstants.PATH_TO_SERVER_CERTIFICATE),
      key: fs.readFileSync(AppConstants.PATH_TO_SERVER_KEY),
      name: AppConstants.APP_NAME,
      log: this.logger,
    });
  }

  start() {
    this.mongoose();

    //configure application
    this.config();

    //add routes
    this.routes();

    //add api
    this.api();

    this.listen();
  }


  private listen() {
    // this.listener = new SocketService();
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
    // let router: express.Router = express.Router();
    // IndexRoute.INSTANCE.create(router);
    // ArticleRoute.INSTANCE.create(router);
    // PassportRoute.INSTANCE.create(router);
    // this.server.use('/api', router);
  }

  /**
   * Create router
   *
   * @class Server
   * @method api
   */
  public routes() {
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    //add static paths
    // this.server.use(express.static(path.join(__dirname, "public")));

    //configure pug
    // this.server.set("views", path.join(__dirname, "views"));
    // this.server.set("view engine", "pug");

    // Compression middleware (should be placed before express.static)
    // this.server.use(compression({
    //   threshold: 512
    // }));

    // this.server.use(cors({
    //   origin: ['http://localhost:4200', 'https://wiki.shashki.online'],
    //   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    //   credentials: true
    // }));

    // this.server.use(session({
    //   secret: 'ytunolosabe',
    //   resave: false,
    //   saveUninitialized: false,
    // }));
    // this.server.use(passport.initialize());
    // this.server.use(passport.session());
    // passportSetup(passport);
    this.server.use(restify.CORS({
      origins: ['https://wiki.shashki.online', 'http://localhost:4200'],   // defaults to ['*']
      credentials: true,                 // defaults to false
      // headers: ['x-foo']                 // sets expose-headers
    }));
    //use logger middlware
    this.server.use((req, res, next) => {
      console.log(new Date(), req.method, req.url);
      next();
    });

    this.server.on('uncaughtException', function (request, response, route, error) {
      console.error(error.stack);
      response.send(error);
    });

    this.server.use(restify.queryParser());
    //use json form parser middlware
    this.server.use(restify.bodyParser());

    // use query string parser middlware
    // this.server.use(bodyParser.urlencoded({
    //   extended: true
    // }));

    //use cookie parker middleware middlware
    // this.server.use(cookieParser("SECRET_GOES_HERE321123sfdsfsdf"));

    //use override middlware
    // this.server.use(methodOverride());

    //catch 404 and forward to error handler
    // this.server.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    //   err.status = 404;
    //   next(err);
    // });

    //error handling
    // this.server.use(errorHandler());
    this.server.listen(this.getHost(), this.getHost(), () => {
      console.log('%s listening at %s', this.server.name, this.server.url);
    });
    this.server.on('error', (error) => {
      this.onError(error);
    });
    this.server.on('listening', () => {
      this.onListening();
    });
  }

  getPort() {
    return this.normalizePort(process.env.PORT || 3000);//config.get('port');
  }

  getHost() {
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

  private mongoose() {
    const mongoService = new MongoService();
    mongoService.connect();
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
