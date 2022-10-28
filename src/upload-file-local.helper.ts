import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { extname } from 'path';

export const customFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
    return callback(new BadRequestException('Only image files are allowed!'));
  }
  callback(null, true);
};

// update the name of an image to make make it unique
export const editFileName = (req: any, file: any, callback: any) => {
  const name = 'upload';
  const fileExtName = extname(file.originalname);
  const randomName = Date.now();
  // callback(null, `${name}_${randomName}${fileExtName}`);
  callback(null, `${randomName}_${file.originalname}`);
};
