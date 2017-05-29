import {RepositoryBase} from "./repository-base";
import {IArticle, ArticleModel} from "../http/article";
import {provide} from "../ioc/ioc";
import {TYPES} from "../constant/types";

@provide(TYPES.ArticleRepository)
export class ArticleRepository extends RepositoryBase<IArticle> {
  constructor() {
    super(ArticleModel);
  }
}
