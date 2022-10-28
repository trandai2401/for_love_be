import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManufacturerService } from './manufacturer.service';
import { ManufacturerController } from './manufacturer.controller';
import {
  Manufacturer,
  ManufacturerSchema,
} from 'src/schemas/manufacturer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Manufacturer.name, schema: ManufacturerSchema },
    ]),
  ],
  controllers: [ManufacturerController],
  providers: [ManufacturerService],
})
export class ManufacturerModule {}

