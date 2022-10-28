import { validate, IsNotEmpty } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';
class AppConfig {
  @IsNotEmpty()
  port: string;

  @IsNotEmpty()
  dbUrl: string;
}

const config = new AppConfig();
config.port = process.env.PORT;
config.dbUrl = process.env.MONGODB_URL;

(async () => {
  const errors = await validate(config);
  if (errors && errors.length) {
    throw new InternalServerErrorException('Missing config!');
  }
})();

export default config;
