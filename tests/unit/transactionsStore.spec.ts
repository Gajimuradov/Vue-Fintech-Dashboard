import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useTransactionsStore } from '@/stores/transactions';

describe('transactions store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.useRealTimers();
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
    expect(store.currencyTotals).toMatchObject([
      { currency: 'USD', amount: 4360, count: 3 },
      { currency: 'GBP', amount: 980.75, count: 1 },
    ]);
    expect(store.dailyTrend).toHaveLength(4);
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

  it('adds live transactions on a controlled schedule and stops after max updates', async () => {
    const store = useTransactionsStore();

    await store.loadTransactions({ delayMs: 0 });
    vi.useFakeTimers();
    store.startLiveUpdates({
      minIntervalMs: 10,
      maxIntervalMs: 10,
      durationMs: 1_000,
      maxUpdates: 1,
      now: () => new Date('2026-05-10T10:00:00.000Z'),
      random: () => 0,
    });

    expect(store.liveEnabled).toBe(true);
    expect(store.liveRemainingSeconds).toBe(1);
    expect(store.liveRemainingText).toBe('0:01');

    vi.advanceTimersByTime(10);

    expect(store.transactions[0]).toMatchObject({
      id: 'TRX-1009',
      status: 'pending',
      type: 'deposit',
      currency: 'USD',
      userName: 'Daria Volkova',
    });
    expect(store.lastAddedTransaction?.id).toBe('TRX-1009');
    expect(store.liveUpdatesCount).toBe(1);
    expect(store.liveEnabled).toBe(false);
    expect(store.liveRemainingSeconds).toBe(0);
  });

  it('counts down live mode time while updates are running', async () => {
    const store = useTransactionsStore();

    await store.loadTransactions({ delayMs: 0 });
    vi.useFakeTimers();
    store.startLiveUpdates({
      minIntervalMs: 500,
      maxIntervalMs: 500,
      durationMs: 60_000,
      maxUpdates: 0,
    });

    expect(store.liveRemainingText).toBe('1:00');

    vi.advanceTimersByTime(31_000);

    expect(store.liveRemainingText).toBe('0:29');

    store.stopLiveUpdates();
  });
});
