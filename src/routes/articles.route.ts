import {ArticleService} from "../service/article.service";
import {BaseRoute} from "./route";
export class ArticleRoute extends BaseRoute{

  static INSTANCE = new ArticleRoute();

  findArticles(req, resp, next) {
    ArticleService.INSTANCE.findAll().then((articles) => {
      // super.send(req, resp, articles, next, 201);
    }).catch((err) => {
      // super.sendErr(req, resp, err, next, 500);
    })
  }

  findArticle(req, resp, next) {

  }

  // create(router: Router) {
  //   router.get('/articles', this.findArticles);
  //   router.get('/articles/:slug', this.findArticle);
  // }
}