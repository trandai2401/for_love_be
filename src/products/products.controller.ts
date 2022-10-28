import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Query, UploadedFiles } from '@nestjs/common/decorators';
import { diskStorage } from 'multer';
import { editFileName, customFileFilter } from '../upload-file-local.helper';
import { extname } from 'path';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PaginationParams } from 'src/common/dto/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: customFileFilter,
      storage: diskStorage({
        destination: './file',
        filename: editFileName,
      }),
    }),
  )
  create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createProductDto: CreateProductDto,
  ) {
    const filesArr = [];
    files.forEach((file) => {
      filesArr.push(file.filename);
    });
    createProductDto.images = filesArr;
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() { page, limit }: PaginationParams, @Query() query: any) {
    const { category, manufacturer, term } = query;
    return this.productsService.findAll(
      page,
      limit,
      category,
      manufacturer,
      term,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: customFileFilter,
      storage: diskStorage({
        destination: './file',
        filename: editFileName,
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const filesArr = updateProductDto.images;
    files.forEach((file) => {
      filesArr.push(file.filename);
    });
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post('images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './file',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  handleUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body('id') id: string,
  ) {
    this.productsService.updateById(id, file.filename);
    return { url: file.filename };
  }
  @Get('related/:id')
  relatedproducts(@Param('id') id: string) {
    return this.productsService.relatedproducts(id);
  }
}

