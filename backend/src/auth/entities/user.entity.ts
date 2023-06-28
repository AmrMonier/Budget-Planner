import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Token } from './token.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: 0 })
  total: number;

  @Column({ default: 0 })
  total_expenses: number;

  @Column({ default: 0 })
  total_income: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Token, (token) => token.user, { onDelete: 'CASCADE' })
  tokens: Token[];

  @OneToMany(() => Transaction, (trx) => trx.user, { onDelete: 'CASCADE' })
  transactions: Token[];
}
