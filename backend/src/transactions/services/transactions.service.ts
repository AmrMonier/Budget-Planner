import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { TransactionDto } from '../dto/transaction.dto';
import {
  FilterEnum,
  GetTransactionQuery,
  transactionType,
} from '../utils/transactions.types';
import { expenses, income } from 'src/transactions/utils/categories.json';
import { User } from 'src/auth/entities/user.entity';
@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createTransaction(
    user: User,
    transactionDto: TransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...transactionDto,
      user_id: user.id,
    });
    await this.saveAndUpdateMoney(transaction, user);
    return transaction;
  }

  async updateTransaction(
    transactionId: number,
    transactionDto: TransactionDto,
    user: User,
  ): Promise<Transaction> {
    const transaction = await this.getTransaction(transactionId, user);
    transaction.amount = transactionDto.amount;
    transaction.category = transactionDto.category;
    transaction.date = transactionDto.date;
    await this.saveAndUpdateMoney(transaction, user);
    return transaction;
  }

  async deleteTransaction(transactionId: number, user: User): Promise<void> {
    const transaction = await this.getTransaction(transactionId, user);
    await this.transactionRepository.remove(transaction);
    await this.updateUserMoney(user, transaction, true);
  }

  private async getTransaction(
    transactionId: number,
    user: User,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneBy({
      id: transactionId,
    });
    if (!transaction || transaction.user_id !== user.id) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async getTransactions(
    userId: number,
    query: GetTransactionQuery,
  ): Promise<object> {
    const queryBuilder: SelectQueryBuilder<Transaction> =
      this.transactionRepository.createQueryBuilder('t');
    // Apply filters
    if (query.from) {
      queryBuilder.andWhere('t.date >= :startDate', {
        startDate: query.from,
      });
    }
    if (query.to) {
      queryBuilder.andWhere('t.date <= :endDate', {
        endDate: query.to,
      });
    }
    const interval = query.interval;
    // Apply interval
    switch (interval) {
      case FilterEnum.DAILY:
        queryBuilder.addSelect(
          "TO_CHAR(t.date, 'YYYY-MM-DD')",
          'transaction_date',
        );
        break;
      // case FilterEnum.WEEKLY:
      //   queryBuilder.addSelect(
      //     "TO_CHAR(t.date, 'Mon-FMDD')",
      //     'transaction_date',
      //   );
      //   break;
      case FilterEnum.MONTHLY:
        queryBuilder.addSelect(
          "TRIM(TO_CHAR(t.date, 'YYYY Month'))",
          'transaction_date',
        );
        break;

      case FilterEnum.YEARLY:
        queryBuilder.addSelect(
          "TRIM(TO_CHAR(t.date, 'YYYY'))",
          'transaction_date',
        );
        break;
      default:
        throw new Error('Invalid interval specified.');
    }

    queryBuilder
      .leftJoin('t.user', 'user')
      .andWhere('user.id = :userId', { userId })
      .orderBy('transaction_date', 'ASC')
      .addOrderBy('t.id', 'ASC');


    // Join user and execute the query
    const transactions = await queryBuilder.getRawMany();

    const transactionsByDate = transactions.reduce((acc, t) => {
      const { transaction_date, ...rest } = t;
      if (!acc[transaction_date]) {
        acc[transaction_date] = [];
      }
      acc[transaction_date].push(rest);
      return acc;
    }, {});
    return transactionsByDate;
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
  private async saveAndUpdateMoney(
    transaction: Transaction,
    user: User,
  ): Promise<void> {
    await this.transactionRepository.save(transaction);
    await this.updateUserMoney(user, transaction);
  }

  private async updateUserMoney(
    user: User,
    transaction: Transaction,
    isDelete = false,
  ): Promise<void> {
    let amount = transaction.amount;
    if (isDelete) amount *= -1;
    if (transaction.category === 'income') {
      user.total_income += amount;
    } else {
      user.total_expenses += amount;
    }
    user.total = user.total_income - user.total_expenses;
    await this.userRepository.save(user);
  }

  getTransactionById(id: number, userId: number): Promise<Transaction> {
    return this.transactionRepository.findOneByOrFail({ id, user_id: userId });
  }
}
