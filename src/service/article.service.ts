import {IArticle} from "../model/article";
import {ArticleRepository} from "../dao/article-repository";
export class ArticleService {

  static INSTANCE: ArticleService = new ArticleService();

  createArticle(title, content, black, rules, squareSize) {
    let repo = new ArticleRepository();
  }

  findAll() {
    let repo = new ArticleRepository();
    return new Promise((resolve, reject) => {
      repo.find((err: any, res: IArticle[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    })
  }

  findById(_id: string) {
    if (!_id) {
      return Promise.reject(null);
    }

    let repo = new ArticleRepository();
    return new Promise((resolve, reject) => {
      repo.findById(_id, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
    })
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
