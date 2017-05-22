import {ArticleService} from "../service/article.service";
import {BaseRoute} from "./route";
import {Response} from "../model/response";
import HTTP_STATUS_CODES from 'http-status-enum';
import * as restify from "restify";

export class ArticleRoute extends BaseRoute {

  static INSTANCE = new ArticleRoute();

  findArticles(req, res, next) {
    ArticleService.INSTANCE.findAll((err, articles) => {
      next.ifError(err);
      res.json(new Response(true, 'There are all articles', articles));
    });
  }

  findArticle(req, res, next) {
    const id = req.params.id;
    const article = ArticleService.INSTANCE.findById(id, (err, article) => {
      next.ifError(err);
      res.json(new Response(true, 'Found article', article));
    });
  }

  create(server) {
    server.get('/articles', this.findArticles);
    server.get('/articles/:id', this.findArticle);
  }

  // create(router: Router) {
  //   router.get('/articles', this.findArticles);
  //   router.get('/articles/:slug', this.findArticle);
  // }
}