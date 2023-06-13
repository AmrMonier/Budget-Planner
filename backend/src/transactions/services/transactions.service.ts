import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { TransactionDto } from '../dto/transaction.dto';
import { transactionType } from '../utils/transactions.types';
import { expenses, income } from 'src/transactions/utils/categories.json';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(
    user: User,
    transactionDto: TransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...transactionDto,
      user_id: user.id,
    });
    const trx = await this.transactionRepository.save(transaction);
    await this.RecalculateUserMoney({ ...transaction, user });
    return trx;
  }

  async getTransactions(userId: number, query: any): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.find({
      where: {
        user_id: userId,
        ...query,
      },
    });
    return transactions;
  }

  async getTransactionById(id: number, userId: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.user_id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to access this transaction',
      );
    }
    return transaction;
  }

  async updateTransaction(
    id: number,
    transactionDto: TransactionDto,
    user: User,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.user_id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to update this transaction',
      );
    }
    await this.RecalculateUserMoney({
      ...transaction,
      amount: -transaction.amount,
      user,
    });
    const updatedTransaction = { ...transaction, ...transactionDto };
    await this.transactionRepository.save(updatedTransaction);
    await this.RecalculateUserMoney({
      ...updatedTransaction,
      user,
    });
    return updatedTransaction;
  }

  async deleteTransaction(id: number, user: User): Promise<void> {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.user_id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to delete this transaction',
      );
    }

    await this.transactionRepository.remove(transaction);
    await this.RecalculateUserMoney({
      ...transaction,
      amount: -transaction.amount,
      user,
    });
    await user.save();
  }

  async getDistinctCategories(type: transactionType) {
    const categories = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('DISTINCT transaction.category', 'category')
      .where('type = :type', { type })
      .getRawMany();

    const userCategories = categories.map((c) => c.category);
    switch (type) {
      case 'expenses':
        return Array.from(new Set(expenses.concat(userCategories)));
      case 'income':
        return Array.from(new Set(income.concat(userCategories)));
    }
  }

  private async RecalculateUserMoney(trx: Transaction) {
    const { user } = trx;

    switch (trx.type) {
      case 'income':
        user.total_income += trx.amount;
        break;
      case 'expenses':
        user.total_expenses += trx.amount;
        break;
    }

    user.total = user.total_income - user.total_expenses;
    await user.save();
  }
}
