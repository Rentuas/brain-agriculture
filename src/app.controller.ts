import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Get('/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  status(): string {
    return 'ok';
  }
}
