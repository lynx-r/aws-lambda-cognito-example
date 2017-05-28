import {UserService} from "../service/user.service";
import {Response} from "../model/response";
import {inject, unmanaged} from "inversify";
import {Controller, Get, interfaces, Post, TYPE} from "inversify-restify-utils";
import {TYPES} from "../constant/types";
import {nconf} from "../config/config";
import jwt = require("jsonwebtoken");
import * as restify from 'restify';
import TAGS from "../constant/tags";
import {provideNamed} from "../ioc/ioc";

@Controller('/users')
@provideNamed(TYPE.Controller, TAGS.UserController)
export class UserController implements interfaces.Controller {

  constructor(@inject(TYPES.UserService) private userService: UserService) {
  }

  @Post('/register')
  register(req: restify.Request, res: restify.Response, next: restify.Next) {
    this.userService.register(req.body.given_name, req.body.email, req.body.password, (err, user) => {
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
    this.userService.confirmRegistration(req.body.email, req.body.confirmationCode, (error, result) => {
      if (error) {
        console.error(error);
        return res.json(new Response(false, error));
      }
      res.json(new Response(true, 'You were confirmed', result));
      next();
    })
  }

  @Post('/resendCode')
  resendCode(req: restify.Request, res: restify.Response, next: restify.Next) {
    this.userService.resendCode(req.body.email, (error, result) => {
      if (error) {
        console.error(error);
        return res.json(new Response(false, error));
      }
      res.json(new Response(true, 'Code was sent', result));
      next();
    })
  }

  @Post('/authenticate')
  authenticate(req, res, next) {
    this.userService.authenticate(req.body.email, req.body.password, (error, user) => {
      if (error) {
        console.error(error);
        return res.json(new Response(false, error));
      }
      res.json(new Response(true, 'User was authenticated', user));
      next();
    });
  }

  @Post('/forgotPassword')
  forgotPassword(req, res, next) {
    this.userService.forgotPassword(req.body.email, (error, result) => {
      if (error) {
        console.error(error);
        return res.json(new Response(false, error));
      }
      res.json(new Response(true, 'An email was sent', result));
      next();
    })
  }

  @Post('/confirmNewPassword')
  confirmNewPassword(req: restify.Request, res: restify.Response, next: restify.Next) {
    this.userService.confirmNewPassword(req.body.email, req.body.confirmationCode, req.body.password, (error, result) => {
      if (error) {
        console.error(error);
        return res.json(new Response(false, error));
      }
      res.json(new Response(true, 'Password was changed', result));
      next();
    })
  }

  @Get('/logout')
  logout(req: restify.Request, res: restify.Response, next: restify.Next) {
    this.userService.logout(req.body.email, (error, result) => {
      if (error) {
        console.error(error);
        return res.json(new Response(false, error));
      }
      res.json(new Response(true, 'You were logged out', result));
      next();
    })
  }

}