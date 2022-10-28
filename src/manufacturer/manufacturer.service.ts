import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Manufacturer,
  ManufacturerDocument,
} from 'src/schemas/manufacturer.schema';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectModel(Manufacturer.name)
    private categoryModel: Model<ManufacturerDocument>,
  ) {}

  create(createManufacturerDto: CreateManufacturerDto) {
    return 'This action adds a new manufacturer';
  }

  findAll() {
    return this.categoryModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} manufacturer`;
  }

  update(id: number, updateManufacturerDto: UpdateManufacturerDto) {
    return `This action updates a #${id} manufacturer`;
  }

  remove(id: number) {
    return `This action removes a #${id} manufacturer`;
  }
}

