import { Injectable, ArgumentMetadata } from '@nestjs/common';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const createProduct = new this.productModel(createProductDto);
    console.log(createProduct);

    return createProduct.save();
  }

  findByCategoryAndManufacturer(
    category: string[],
    manufacturer: string[],
    q: string,
  ) {
    const filter = {};
    if (category) filter['category'] = { $in: category };
    if (manufacturer) filter['manufacturer'] = { $in: manufacturer };
    if (q) filter['name'] = { $regex: `${q}` };
    return this.productModel.find(filter);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const filter = { _id: id };
    const result = await this.productModel.findOneAndUpdate(
      filter,
      updateProductDto,
      {
        returnOriginal: false,
      },
    );
    return result;
  }

  async updateById(id: string, imgURL: string) {
    return await this.productModel.findByIdAndUpdate(
      { _id: id },
      { $push: { urlImage: imgURL } },
    );
  }

  async findAll(
    documentsToPage = 1,
    limitOfDocuments = 12,
    category?: string,
    manufacturer?: string,
    q?: string,
  ) {
    const filter = {};
    if (category) filter['category'] = { $in: category };
    if (manufacturer) filter['manufacturer'] = { $in: manufacturer };
    if (q) filter['name'] = { $regex: `${q}` };
    const findQuery = this.productModel
      .find(filter)
      .sort({ _id: 1 })
      .skip((documentsToPage - 1) * limitOfDocuments);

    if (limitOfDocuments) {
      findQuery.limit(limitOfDocuments);
    }

    const count = await this.productModel.find(filter).count();
    const results = await findQuery;

    return { results, count };
  }

  findOne(id: string) {
    return this.productModel.findById(id);
  }

  remove(id: string) {
    return `This action removes a #${id} product`;
  }

  async relatedproducts(id: string) {
    const product = await this.productModel.findById(id);
    return this.productModel.aggregate([
      {
        $match: {
          _id: { $not: { $eq: product._id } },
          category: product.category,
        },
      },
      { $limit: 3 },
      {
        $addFields: {
          price_gap: {
            $abs: {
              $subtract: ['$price', product.price],
            },
          },
        },
      },
      {
        $sort: {
          price_gap: 1,
        },
      },
    ]);
  }
}

