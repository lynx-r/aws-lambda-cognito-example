import {RepositoryBase} from "./repository-base";
import {IArticle, ArticleModel} from "../model/article";
import {injectable} from "inversify";

@injectable()
export class ArticleRepository extends RepositoryBase<IArticle> {
  constructor() {
    super(ArticleModel);
  }
}
