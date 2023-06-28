import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TrxTypes, transactionType } from '../utils/transactions.types';

export class TransactionDto {
  @IsString()
  title: string;

  @IsDateString()
  @IsOptional()
  date: Date;

  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsString()
  @IsEnum(TrxTypes)
  type: transactionType;
}
