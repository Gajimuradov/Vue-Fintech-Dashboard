import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import { useTransactionsStore } from '@/stores/transactions';

describe('transactions store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('loads transactions and exposes filtered selectors', async () => {
    const store = useTransactionsStore();

    await store.loadTransactions({ delayMs: 0 });
    store.setStatusFilter('completed');
    store.setSort('amount', 'desc');

    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.filteredTransactions).toHaveLength(4);
    expect(store.filteredTransactions[0].id).toBe('TRX-1005');
    expect(store.totalAmount).toBe(5340.75);
    expect(store.statusAnalytics.find((item) => item.key === 'completed')).toMatchObject({
      count: 4,
      percentage: 100,
    });
  });

  it('stores error state when mock api fails', async () => {
    const store = useTransactionsStore();

    await store.loadTransactions({ delayMs: 0, shouldFail: true });

    expect(store.loading).toBe(false);
    expect(store.transactions).toEqual([]);
    expect(store.error).toBe('Не удалось загрузить операции из mock API.');
  });

  it('marks no-results state after filters exclude loaded data', async () => {
    const store = useTransactionsStore();

    await store.loadTransactions({ delayMs: 0 });
    store.setSearchQuery('missing-user');

    expect(store.isEmpty).toBe(false);
    expect(store.hasNoResults).toBe(true);
  });
});
