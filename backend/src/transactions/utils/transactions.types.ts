export type transactionType = 'income' | 'expenses';

export enum TrxTypes {
  expenses = 'expenses',
  income = 'income',
}
export enum FilterEnum {
  DAILY = 'daily',
  // WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export type GetTransactionQuery = {
  from?: Date;
  to?: Date;
  interval: string;
};
