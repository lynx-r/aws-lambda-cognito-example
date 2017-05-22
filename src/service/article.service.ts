import {IArticle} from "../model/article";
import {ArticleRepository} from "../dao/article-repository";
import {injectable} from "inversify";

@injectable()
export class ArticleService {

  createArticle(title, content, black, rules, squareSize) {
    let repo = new ArticleRepository();
  }

  findAll(callback) {
    let repo = new ArticleRepository();
    repo.find((err: any, res: IArticle[]) => {
      callback(err, res);
    });
  }

  findById(_id: string, callback) {
    if (!_id) {
      throw 'Invalid id';
    }

    let repo = new ArticleRepository();
    repo.findById(_id, callback);
  }

  updateArticle(article: IArticle) {
    let repo = new ArticleRepository();
    return new Promise((resolve, reject) => {
      repo.update(article._id, article, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(article);
        }
      })
    })
  }

  removeArticle(_id: string) {
    if (!_id) {
      return Promise.reject(null);
    }
    let repo = new ArticleRepository();
    return new Promise((resolve, reject) => {
      repo.delete(_id, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
    })
  }

}
