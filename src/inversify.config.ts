// import "reflect-metadata";
// import {Container} from "inversify";
// import {SocketService} from "./service/socket-listener.service";
// import {SquareRepository} from "./dao/square-repository";
// import {Square} from "./model/square";
//
// const myContainer = new Container();
//
// myContainer.bind<SquareRepository>(SquareRepository).toSelf();
// myContainer.bind<Square>(Square).toSelf();
//
// export { myContainer };
import "reflect-metadata";
import {Container} from "inversify";
import {ArticlesController} from "./routes/articles.controller";
import {interfaces, TYPE} from "inversify-restify-utils";
import {ArticleService} from "./service/article.service";
import {TYPES} from "./types.const";
const container = new Container();
container.bind<interfaces.Controller>(TYPE.Controller).to(ArticlesController).whenTargetNamed('ArticlesController');
container.bind<ArticleService>(TYPES.ArticleService).to(ArticleService);
export {container};