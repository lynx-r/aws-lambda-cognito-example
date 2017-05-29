import db = require("dynongo");

import {TYPES} from "../constant/types";
import {provideSingleton} from "../ioc/ioc";
import {Table} from "dynongo/lib/table";

@provideSingleton(TYPES.ArticleService)
export class ArticleService {

  Article: Table;

  constructor() {
    this.Article = db.table('Article');
  }

  findAll(cb, err) {
    this.Article.find().exec()
      .then(cb)
      .catch(err);
  }

  findById(_id: string, callback) {
    callback();
  }

  createArticle(body: any, cb: (newArticle) => any, err) {
    const key = {
      slug: body.slug,
      title: body.title
    };
    const value = {
      content: body.content
    };
    this.Article.insert(key, value).exec()
      .then(cb)
      .catch(err);
  }
}
