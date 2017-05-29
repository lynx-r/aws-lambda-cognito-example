import {IArticle} from "../http/article";
import {ArticleRepository} from "../dao/article-repository";
import {inject} from "inversify";
import {TYPES} from "../constant/types";
import {provideSingleton} from "../ioc/ioc";

@provideSingleton(TYPES.ArticleService)
export class ArticleService {

  constructor(@inject(TYPES.ArticleRepository) private repo: ArticleRepository) {
  }

  findAll(callback) {
    this.repo.find((err: any, res: IArticle[]) => {
      callback(err, res);
    });
  }

  findById(_id: string, callback) {
    if (!_id) {
      throw 'Invalid id';
    }

    this.repo.findById(_id, callback);
  }

}
