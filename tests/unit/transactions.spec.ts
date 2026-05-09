import { describe, expect, it } from 'vitest';

import { transactions } from '@/data/transactions';
import type { TransactionFilters } from '@/types/transaction';
import { buildStatusAnalytics, buildTypeAnalytics } from '@/utils/analytics';
import { defaultFilters, filterAndSortTransactions, filterTransactions, sortTransactions } from '@/utils/transactions';

describe('transaction filtering and sorting', () => {
  it('filters by user name and id search query', () => {
    expect(filterTransactions(transactions, { ...defaultFilters, searchQuery: 'anna' })).toHaveLength(1);
    expect(filterTransactions(transactions, { ...defaultFilters, searchQuery: 'trx-1003' })[0].userName).toBe(
      'Sophia Nguyen',
    );
  });

  it('filters by status and type', () => {
    const result = filterTransactions(transactions, {
      ...defaultFilters,
      status: 'failed',
      type: 'withdrawal',
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('TRX-1008');
  });

  it('sorts by amount ascending', () => {
    const result = sortTransactions(transactions, { sortField: 'amount', sortDirection: 'asc' });

    expect(result[0].id).toBe('TRX-1006');
    expect(result.at(-1)?.id).toBe('TRX-1005');
  });

  it('applies filter and date sorting together', () => {
    const filters: TransactionFilters = {
      ...defaultFilters,
      status: 'completed',
      sortField: 'createdAt',
      sortDirection: 'asc',
    };

    const result = filterAndSortTransactions(transactions, filters);

    expect(result.map((transaction) => transaction.id)).toEqual(['TRX-1007', 'TRX-1005', 'TRX-1004', 'TRX-1001']);
  });

  it('builds analytics by status and type', () => {
    const statusAnalytics = buildStatusAnalytics(transactions);
    const typeAnalytics = buildTypeAnalytics(transactions);

    expect(statusAnalytics).toMatchObject([
      { key: 'completed', count: 4, percentage: 50 },
      { key: 'pending', count: 2, percentage: 25 },
      { key: 'failed', count: 2, percentage: 25 },
    ]);
    expect(typeAnalytics).toMatchObject([
      { key: 'deposit', count: 2, percentage: 25 },
      { key: 'withdrawal', count: 2, percentage: 25 },
      { key: 'payment', count: 2, percentage: 25 },
      { key: 'transfer', count: 2, percentage: 25 },
    ]);
  });
});
