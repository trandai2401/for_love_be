import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dtos/create-cat.dto';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
@ApiTags('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.createCat(createCatDto);
  }

  @Get()
  async getAll(): Promise<Cat[]> {
    return this.catsService.getAll();
  }
}
