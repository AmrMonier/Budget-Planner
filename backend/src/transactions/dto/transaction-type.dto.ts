import { IsEnum, IsString } from 'class-validator';
import { TrxTypes, transactionType } from '../utils/transactions.types';

export class TransactionTypeDto {
  @IsString()
  @IsEnum(TrxTypes)
  type: transactionType;
}
