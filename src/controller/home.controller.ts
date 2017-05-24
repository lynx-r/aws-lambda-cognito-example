import { Controller, Get, TYPE } from 'inversify-restify-utils';
import { provideNamed } from '../ioc/ioc';
import TAGS from '../constant/tags';

@provideNamed(TYPE.Controller, TAGS.HomeController)
@Controller('/')
export class HomeController {
  @Get('/')
  public get(): string {
    return 'Home sweet home';
  }
}
