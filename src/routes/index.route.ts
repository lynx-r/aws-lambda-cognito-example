import { BaseRoute } from "./route";
import {ArticleService} from "../service/article.service";
import {ArticleRoute} from "./articles.route";


/**
 * / route
 *
 * @class User
 */
export class IndexRoute extends BaseRoute {

  public static INSTANCE: IndexRoute = new IndexRoute();

  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  // public create(router: Router) {
  //   //log
  //   console.log("[IndexRoute::create] Creating index route.");
  //
  //   //add home page route
  //   router.get('/', this.index);
  // }

  /**
   * Constructor
   *
   * @class IndexRoute
   * @constructor
   */
  constructor() {
    super();
  }

  index(req, resp, next) {
    // this.send(req, resp, {message: 'It works'}, next);
  }

}
