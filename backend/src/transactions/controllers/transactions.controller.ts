import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionDto } from '../dto/transaction.dto';
import { TransactionsService } from '../services/transactions.service';
import { Request } from 'express';
import { IdDto } from 'src/global-dto/id.dto';
import { TransactionTypeDto } from '../dto/transaction-type.dto';
import { AuthGuard } from '@nestjs/passport';
import { IsVerifiedGuard } from 'src/auth/utils/IsVerified.guard';
import { GetTransactionDto } from '../dto/get-transaction.dto';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'), IsVerifiedGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  createTransaction(
    @Req() { user }: Request,
    @Body() transactionDto: TransactionDto,
  ) {
    return this.transactionsService.createTransaction(user, transactionDto);
  }

  @Get()
  getTransactions(@Req() { user }: Request, @Query() query: GetTransactionDto) {
    return this.transactionsService.getTransactions(user?.id, query);
  }

  @Get('categories')
  getCategories(@Query() { type }: TransactionTypeDto) {
    return this.transactionsService.getDistinctCategories(type);
  }

  @Get(':id')
  getTransactionById(@Req() { user }: Request, @Param() { id }: IdDto) {
    return this.transactionsService.getTransactionById(id, user?.id);
  }

  @Patch(':id')
  updateTransaction(
    @Req() { user }: Request,
    @Param() { id }: IdDto,
    @Body() transactionDto: TransactionDto,
  ) {
    return this.transactionsService.updateTransaction(id, transactionDto, user);
  }

  @Delete(':id')
  deleteTransaction(@Req() { user }: Request, @Param() { id }: IdDto) {
    return this.transactionsService.deleteTransaction(id, user);
  }
}
