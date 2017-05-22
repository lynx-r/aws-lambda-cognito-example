import {ArticleService} from "../service/article.service";
import {Response} from "../model/response";
import {InternalServerError, ResourceNotFoundError} from "restify";
import {inject, injectable} from "inversify";
import {Controller, Get, interfaces} from "inversify-restify-utils";
import {TYPES} from "../di/types.const";

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