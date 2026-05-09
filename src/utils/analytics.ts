import type { Transaction, TransactionStatus, TransactionType } from '@/types/transaction';
import { statusLabels, statusOrder, typeLabels, typeOrder } from '@/utils/labels';

export type AnalyticsItem<TKey extends string> = {
  key: TKey;
  label: string;
  count: number;
  amount: number;
  percentage: number;
};

function buildAnalytics<TKey extends TransactionStatus | TransactionType>(
  transactions: Transaction[],
  keys: TKey[],
  getKey: (transaction: Transaction) => TKey,
  labels: Record<TKey, string>,
): AnalyticsItem<TKey>[] {
  const totalCount = transactions.length;

  return keys.map((key) => {
    const matchingTransactions = transactions.filter((transaction) => getKey(transaction) === key);
    const count = matchingTransactions.length;
    const amount = matchingTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

    return {
      key,
      label: labels[key],
      count,
      amount,
      percentage,
    };
  });
}

export function buildStatusAnalytics(
  transactions: Transaction[],
): AnalyticsItem<TransactionStatus>[] {
  return buildAnalytics(transactions, statusOrder, (transaction) => transaction.status, statusLabels);
}

export function buildTypeAnalytics(transactions: Transaction[]): AnalyticsItem<TransactionType>[] {
  return buildAnalytics(transactions, typeOrder, (transaction) => transaction.type, typeLabels);
}

