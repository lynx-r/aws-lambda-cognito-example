
/**
 * Constructor
 *
 * @class BaseRoute
 */
export class BaseRoute {

  protected title: string;

  private scripts: string[];

  /**
   * Constructor
   *
   * @class BaseRoute
   * @constructor
   */
  constructor() {
    //initialize variables
    this.title = "Tour of Heros";
    this.scripts = [];
  }

  /**
   * Add a JS external file to the request.
   *
   * @class BaseRoute
   * @method addScript
   * @param src {string} The src to the external JS file.
   * @return {BaseRoute} Self for chaining
   */
  public addScript(src: string): BaseRoute {
    this.scripts.push(src);
    return this;
  }

  /**
   * Render a page.
   *
   * @class BaseRoute
   * @method send
   * @param req {Request} The request object.
   * @param resp {Response} The response object.
   * @param json {String} The json to send.
   * @param next
   * @param status
   * @return void
   */
  // protected send(req: Request, resp: Response, json: any, next: NextFunction, status: number = 200) {
  //   resp.status(status).json(json);
  // }

  // protected sendErr(req: Request, resp: Response, err: any, next: NextFunction, status: number = 500) {
  //   resp.status(status).json(err);
  // }
}
