import {UserService} from "../service/user.service";
import {Response} from "../model/response";
import {InternalServerError, ResourceNotFoundError} from "restify";
import {inject, injectable} from "inversify";
import {Controller, Get, interfaces} from "inversify-restify-utils";
import {TYPES} from "../di/types.const";

@Controller('/users')
@injectable()
export class UsersController implements interfaces.Controller {

  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  @Get('/')
  findUsers(req, res, next) {
  }

  @Get('/:id')
  findUser(req, res, next) {
  }

}