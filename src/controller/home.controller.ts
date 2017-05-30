import { Controller, Get, TYPE } from 'inversify-restify-utils';
import { provideNamed } from '../ioc/ioc';
import {Response} from "../http/response";
import TAGS from '../constant/tags';

@provideNamed(TYPE.Controller, TAGS.HomeController)
@Controller('/')
export class HomeController {

  @Get('/')
  public get(req, res, next) {
    res.json(new Response(true, 'Home sweet home'));
  }

}
