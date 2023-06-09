import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TrxTypes, transactionType } from '../utils/transactions.types';

export class TransactionDto {
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
