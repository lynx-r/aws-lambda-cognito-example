import {UserService} from "../service/user.service";
import {Response} from "../model/response";
import {inject, unmanaged} from "inversify";
import {Controller, Get, interfaces, Post, TYPE} from "inversify-restify-utils";
import {TYPES} from "../constant/types";
import {nconf} from "../config/config";
import jwt = require("jsonwebtoken");
import * as passport from "passport";
import * as restify from 'restify';
import TAGS from "../constant/tags";
import {provideNamed} from "../ioc/ioc";
import {InternalServerError} from "restify";
import {PassportService} from "../service/passport.service";

@Controller('/users')
@provideNamed(TYPE.Controller, TAGS.UserController)
export class UserController implements interfaces.Controller {

  constructor(@inject(TYPES.PassportService) private passportService: PassportService,
              @inject(TYPES.UserService) private userService: UserService) {
  }

  @Post('/')
  createUser(req: restify.Request, res: restify.Response, next: restify.Next) {
    this.userService.createUser(req.body, (err, user) => {
      if (err) {
        console.error(err);
        return res.json(new InternalServerError())
      }
      res.json(new Response(true, 'User was created', user));
      next();
    });
  }

  @Post('/login')
  login(req, res, next) {
    console.log(this.passportService.passport._strategies);
    this.passportService.passport.authenticate('local', function (err, user) {
      if (user == false) {
        res.json(new Response(false, "Login failed"));
      } else {
        //--payload - информация которую мы храним в токене и можем из него получать
        const payload = {
          id: user._id,
          displayName: user.displayName,
          email: user.email
        };
        const token = jwt.sign(payload, nconf.get('jwtSecret'), {expiresIn: 7200}); //здесь создается JWT

        res.json(new Response(true, 'User logged in', {userId: user._id, token: token}));
      }
    })(req, res, next);
  }

  @Get('/')
  findUsers(req, res, next) {
  }

  @Get('/:id')
  findUser(req, res, next) {
  }

}