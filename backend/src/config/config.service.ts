import { Injectable, Logger } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { parse } from 'dotenv';
import * as Joi from 'joi';
@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  public env: {
    APP_URL: string;
    PORT: number;
    DB_HOST: string;
    DB_USER: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_PORT: number;
    DB_SSL: boolean;
    NODEMAILER_PASSWORD: string;
    NODEMAILER_USER: string;
    APP_SECRET: string;
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
      APP_URL: Joi.string().required(),
      PORT: Joi.number().required().port(),
      DB_HOST: Joi.string().required().hostname(),
      DB_USER: Joi.string().required(),
      DB_NAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      DB_PORT: Joi.number().required().port(),
      DB_SSL: Joi.boolean().required(),
      NODEMAILER_PASSWORD: Joi.string().required(),
      NODEMAILER_USER: Joi.string().required(),
      APP_SECRET: Joi.string().required(),
    })
      .unknown(true)
      .options({ convert: true });
    const { error, value } = validationScheme.validate(config);
    if (error) throw new Error(`Env Error: ${error.message}`);
    return value;
  }

  private initEnvironmentVariables(config: { [key: string]: string }) {
    this.env = {
      APP_URL: config.APP_URL,
      DB_HOST: config.DB_HOST,
      DB_NAME: config.DB_NAME,
      DB_PASSWORD: config.DB_PASSWORD,
      DB_PORT: +config.DB_PORT,
      DB_USER: config.DB_USER,
      DB_SSL: config.DB_SSL === 'true',
      PORT: +config.PORT,
      NODEMAILER_PASSWORD: config.NODEMAILER_PASSWORD,
      NODEMAILER_USER: config.NODEMAILER_USER,
      APP_SECRET: config.APP_SECRET,
    };
  }
}
