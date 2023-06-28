import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { FilterEnum } from '../utils/transactions.types';

export class GetTransactionDto {
  @IsOptional()
  @IsDateString()
  from: Date;

  @IsOptional()
  @IsDateString()
  to: Date;

  @IsString()
  @IsEnum(FilterEnum)
  interval: string;

  //   get interval(): FilterEnum {
  //     return this.filter || FilterEnum.DAILY;
  //   }
}

// import { IsEnum, IsString } from 'class-validator';
// import { TrxTypes, transactionType } from '../utils/transactions.types';

// export class TransactionTypeDto {
//   type: transactionType;
// }
