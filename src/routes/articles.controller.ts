import {ArticleService} from "../service/article.service";
import {BaseRoute} from "./route";
import {Response} from "../model/response";
import HTTP_STATUS_CODES from 'http-status-enum';
import * as restify from "restify";
import {InternalServerError, ResourceNotFoundError} from "restify";
import {inject, injectable} from "inversify";
import {Controller, Get, interfaces} from "inversify-restify-utils";
import {TYPES} from "../types.const";

@Controller('/articles')
@injectable()
export class ArticlesController implements interfaces.Controller {

  constructor(@inject(TYPES.ArticleService) private articleService: ArticleService) {}

  @Get('/')
  findArticles(req, res, next) {
    this.articleService.findAll((err, articles) => {
      if (err) {
        console.log(err);
        return res.json(new InternalServerError())
      }
      res.json(new Response(true, 'Found articles', articles));
    });
  }

  // findArticle(req, res, next) {
  //   const id = req.params.id;
  //   const article = ArticleService.INSTANCE.findById(id, (err, article) => {
  //     if (err) {
  //       console.error(err);
  //       return res.json(new ResourceNotFoundError());
  //     }
  //     res.json(new Response(true, 'Found article', article));
  //   });
  // }

  // create(server) {
  //   server.get('/articles', this.findArticles);
  //   server.get('/articles/:id', this.findArticle);
  // }

  // create(router: Router) {
  //   router.get('/articles', this.findArticles);
  //   router.get('/articles/:slug', this.findArticle);
  // }
}