import {ArticleService} from "../service/article.service";
import {Response} from "../http/response";
import {InternalServerError, ResourceNotFoundError} from "restify";
import {inject} from "inversify";
import {Controller, Get, interfaces, Post, TYPE} from "inversify-restify-utils";
import {TYPES} from "../constant/types";
import {provideNamed} from "../ioc/ioc";
import TAGS from "../constant/tags";
import * as restify from 'restify';

@Controller('/articles')
@provideNamed(TYPE.Controller, TAGS.ArticleController)
export class ArticleController implements interfaces.Controller {

  constructor(@inject(TYPES.ArticleService) private articleService: ArticleService) {}

  @Post('/create')
  createArticle(req: restify.Request, res: restify.Response, next: restify.Next) {
    this.articleService.createArticle(req.body, (newArticle) => {
      res.json(new Response(true, 'Article was created', newArticle));
      next();
    }, (err) => {
      res.json(new Response(false, 'Creation failed ' + err));
    })
  }

  @Get('/')
  findArticles(req, res, next) {
    this.articleService.findAll((articles) => {
      res.json(new Response(true, 'Found articles', articles));
      next();
    }, (err) => {
      res.json(new Response(false, 'Find failed ' + err));
      next();
    });
  }

  @Get('/:id')
  findArticle(req, res, next) {
    const id = req.params.id;
    const article = this.articleService.findById(id, (err, article) => {
      if (err) {
        res.json(new ResourceNotFoundError());
        next();
        return;
      }
      res.json(new Response(true, 'Found article', article));
      next();
    });
  }

}