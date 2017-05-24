import {ArticleService} from "../service/article.service";
import {Response} from "../model/response";
import {InternalServerError, ResourceNotFoundError} from "restify";
import {inject} from "inversify";
import {Controller, Get, interfaces, TYPE} from "inversify-restify-utils";
import {TYPES} from "../constant/types";
import {provideNamed} from "../ioc/ioc";
import TAGS from "../constant/tags";

@Controller('/articles')
@provideNamed(TYPE.Controller, TAGS.ArticleController)
export class ArticleController implements interfaces.Controller {

  constructor(@inject(TYPES.ArticleService) private articleService: ArticleService) {}

  @Get('/')
  findArticles(req, res, next) {
    this.articleService.findAll((err, articles) => {
      if (err) {
        console.log(err);
        return res.json(new InternalServerError())
      }
      res.json(new Response(true, 'Found articles', articles));
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