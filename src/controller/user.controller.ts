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

@Controller('/users')
@provideNamed(TYPE.Controller, TAGS.UserController)
export class UserController implements interfaces.Controller {

  constructor(@inject(TYPES.UserService) private userService: UserService) {
  }

  @Post('/register')
  register(req: restify.Request, res: restify.Response, next: restify.Next) {
    this.userService.register(req.body.given_name, req.body.username, req.body.email, req.body.password, (err, user) => {
      if (err) {
        console.error(err.message);
        return res.json(new Response(false, err));
      }
      res.json(new Response(true, 'User was created', user));
      next();
    });
  }

  @Post('/confirmRegistration')
  confirmRegistration(req: restify.Request, res: restify.Response, next: restify.Next) {
    this.userService.confirmRegistration(req.body.username, req.body.confirmationCode, (error, response) => {
      if (error) {
        console.error(error);
        return res.json(new Response(false, error));
      }
      res.json(new Response(true, 'You were confirmed', response));
      next();
    })
  }

  @Post('/resendCode')
  resendCode(req: restify.Request, res: restify.Response, next: restify.Next) {
    this.userService.resendCode(req.body.username, (error, response) => {
      if (error) {
        console.error(error);
        return res.json(new Response(false, error));
      }
      res.json(new Response(true, 'Code was sent', response));
      next();
    })
  }

  @Post('/login')
  login(req, res, next) {
    this.userService.authenticate(req.body.username, req.body.password, (error, user) => {
      if (error) {
        console.error(error);
        return res.json(new Response(false, error));
      }
      res.json(new Response(true, 'User was authenticated', user));
      next();
    });
  }

  @Get('/')
  findUsers(req, res, next) {
  }

  @Get('/:id')
  findUser(req, res, next) {
  }

}