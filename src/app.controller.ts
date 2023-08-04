import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:type/:id')
  getAvailableSeats(@Param('id') id: string, @Param('type') type: string): any {
    return this.appService.getAvailableSeats(id, type);
  }
}
