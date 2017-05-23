// don't forget to import
import "reflect-metadata";

import {Container} from "inversify";
import {ArticlesController} from "../controller/articles.controller";
import {interfaces, TYPE} from "inversify-restify-utils";
import {ArticleService} from "../service/article.service";
import {TYPES} from "./types.const";
import {ArticleRepository} from "../dao/article-repository";
import {UsersController} from "../controller/user.controller";
import {UserService} from "../service/user.service";
import {UserRepository} from "../dao/user-repository";
import {LocalStrategy} from "../config/passport/local";
import {JwtStrategy} from "../config/passport/jwt";

const container = new Container();
container.bind<interfaces.Controller>(TYPE.Controller).to(ArticlesController).whenTargetNamed('ArticlesController');
container.bind<interfaces.Controller>(TYPE.Controller).to(UsersController).whenTargetNamed('UsersController');
container.bind<ArticleService>(TYPES.ArticleService).to(ArticleService);
container.bind<ArticleRepository>(TYPES.ArticleRepository).to(ArticleRepository);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<LocalStrategy>(TYPES.LocalStrategy).to(LocalStrategy);
container.bind<JwtStrategy>(TYPES.JwtStrategy).to(JwtStrategy);

export {container};