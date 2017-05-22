import {ArticleService} from "./article.service";
import {Response} from '../model/response';
import {IArticle} from "../model/article";

export class AppService {

  static INSTANCE: AppService = new AppService();

  removeArticle(req, callback: Function) {
    try {
      ArticleService.INSTANCE.removeArticle(req._id).then((article) => {
        let resp = new Response(true, 'Article was removed', article);
        callback(resp);
      });
    } catch (e) {
      let resp = new Response(false, 'Failed to remove article: ' + e);
      callback(resp);
    }
  }

  updateArticle(req, callback: Function) {
    try {
      ArticleService.INSTANCE.updateArticle(req.article).then((article) => {
        let resp = new Response(true, 'Article was updated', article);
        callback(resp);
      });
    } catch (e) {
      let resp = new Response(false, 'Failed to update article: ' + e);
      callback(resp);
    }
  }

  findArticle(req, callback: Function) {
    try {
      ArticleService.INSTANCE.findById(req._id).then((article) => {
        let resp = new Response(true, 'Article found', article);
        callback(resp);
      });
    } catch (e) {
      let resp = new Response(false, 'Failed to found article: ' + e);
      callback(resp);
    }
  }

  findArticles() {
    return ArticleService.INSTANCE.findAll();
  }

  createArticle(req, callback: Function) {
    try {
      // ArticleService.INSTANCE.createArticle(req.title, req.content, req.black, req.rules, req.squareSize).then((article) => {
      //   let resp = new Response(true, 'Article was created', article);
      //   callback(resp);
      // })
    } catch (e) {
      let resp = new Response(false, 'Failed to create article: ' + e);
      callback(resp);
    }
  }

}