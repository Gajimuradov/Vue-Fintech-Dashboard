import type {
  Transaction,
  TransactionCurrency,
  TransactionStatus,
  TransactionType,
} from '@/types/transaction';
import { currencyOrder, statusLabels, statusOrder, typeLabels, typeOrder } from '@/utils/labels';

export type CurrencyTotal = {
  currency: TransactionCurrency;
  amount: number;
  count: number;
};

export type AnalyticsItem<TKey extends string> = {
  key: TKey;
  label: string;
  count: number;
  totals: CurrencyTotal[];
  percentage: number;
};

export type DailyTrendItem = {
  date: string;
  label: string;
  count: number;
  totals: CurrencyTotal[];
  percentage: number;
};

export function buildCurrencyTotals(transactions: Transaction[]): CurrencyTotal[] {
  return currencyOrder
    .map((currency) => {
      const matchingTransactions = transactions.filter((transaction) => transaction.currency === currency);

      return {
        currency,
        amount: matchingTransactions.reduce((sum, transaction) => sum + transaction.amount, 0),
        count: matchingTransactions.length,
      };
    })
    .filter((item) => item.count > 0);
}

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
    const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

    return {
      key,
      label: labels[key],
      count,
      totals: buildCurrencyTotals(matchingTransactions),
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

export function buildDailyTrend(transactions: Transaction[]): DailyTrendItem[] {
  const transactionsByDay = transactions.reduce<Record<string, Transaction[]>>((acc, transaction) => {
    const dayKey = transaction.createdAt.slice(0, 10);
    acc[dayKey] = [...(acc[dayKey] ?? []), transaction];

    return acc;
  }, {});
  const maxCount = Math.max(1, ...Object.values(transactionsByDay).map((items) => items.length));

  return Object.entries(transactionsByDay)
    .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate))
    .map(([date, dayTransactions]) => ({
      date,
      label: new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'short',
      }).format(new Date(`${date}T00:00:00.000Z`)),
      count: dayTransactions.length,
      totals: buildCurrencyTotals(dayTransactions),
      percentage: Math.round((dayTransactions.length / maxCount) * 100),
    }));
}
