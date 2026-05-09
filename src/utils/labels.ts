import type {
  SortDirection,
  SortField,
  TransactionCurrency,
  TransactionStatus,
  TransactionType,
} from '@/types/transaction';

export const statusLabels: Record<TransactionStatus, string> = {
  pending: 'В ожидании',
  completed: 'Выполнено',
  failed: 'Не удалось',
};

export const typeLabels: Record<TransactionType, string> = {
  deposit: 'Пополнение',
  withdrawal: 'Вывод',
  payment: 'Платеж',
  transfer: 'Перевод',
};

export const sortLabels: Record<`${SortField}:${SortDirection}`, string> = {
  'createdAt:desc': 'Сначала новые',
  'createdAt:asc': 'Сначала старые',
  'amount:desc': 'Сначала крупные суммы',
  'amount:asc': 'Сначала небольшие суммы',
};

export const statusOrder: TransactionStatus[] = ['completed', 'pending', 'failed'];

export const typeOrder: TransactionType[] = ['deposit', 'withdrawal', 'payment', 'transfer'];

export const currencyOrder: TransactionCurrency[] = ['USD', 'EUR', 'GBP'];
