import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './controllers/transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './services/transactions.service';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
