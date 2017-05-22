import {RepositoryBase} from "./repository-base";
import {IArticle, ArticleModel} from "../model/article";

export class ArticleRepository extends RepositoryBase<IArticle> {
  constructor() {
    super(ArticleModel);
  }
}

Object.seal(ArticleRepository);