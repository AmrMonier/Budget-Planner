import { Injectable, Logger } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { parse } from 'dotenv';
import * as Joi from 'joi';
@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  public env: {
    PORT: number;
    DB_HOST: string;
    DB_USER: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_PORT: number;
  };
  constructor(environment: string) {
    if (!environment) throw new Error('Environment Must be provided');
    this.logger.log(`Environment ${environment}`);
    const envFilePath = `./env/${environment}.env`;
    let config: { [key: string]: string };
    if (existsSync(envFilePath)) {
      config = parse(readFileSync(envFilePath));
    } else {
      config = process.env;
    }
    config = this.validateEnvironmentVariables(config);
    this.initEnvironmentVariables(config);
  }

  private validateEnvironmentVariables(config: any) {
    const validationScheme = Joi.object({
      PORT: Joi.number().required().port(),
      DB_HOST: Joi.string().required().hostname(),
      DB_USER: Joi.string().required(),
      DB_NAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      DB_PORT: Joi.number().required().port(),
    });
    const { error, value } = validationScheme.validate(config);
    if (error) throw new Error(`Env Error: ${error.message}`);
    return value;
  }

  private initEnvironmentVariables(config: { [key: string]: string }) {
    this.env = {
      DB_HOST: config.DB_HOST,
      DB_NAME: config.DB_NAME,
      DB_PASSWORD: config.DB_PASSWORD,
      DB_PORT: +config.DB_PORT,
      DB_USER: config.DB_USER,
      PORT: +config.PORT,
    };
  }
}
