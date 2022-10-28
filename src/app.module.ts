import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { CatsModule } from './cats/cats.module';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/nest-shopcar'),

    CoreModule,
    CatsModule,
    ProductsModule,
    CategoriesModule,
    ManufacturerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'file'),
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
