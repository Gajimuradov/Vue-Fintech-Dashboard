import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { fetchTransactions } from '@/api/transactionsApi';
import type {
  SortDirection,
  SortField,
  Transaction,
  TransactionFilters,
  TransactionStatus,
  TransactionType,
} from '@/types/transaction';
import {
  buildCurrencyTotals,
  buildDailyTrend,
  buildStatusAnalytics,
  buildTypeAnalytics,
  type AnalyticsItem,
  type CurrencyTotal,
  type DailyTrendItem,
} from '@/utils/analytics';
import { generateLiveTransaction } from '@/utils/liveTransactions';
import { defaultFilters, filterAndSortTransactions } from '@/utils/transactions';

type LiveUpdateOptions = {
  minIntervalMs?: number;
  maxIntervalMs?: number;
  durationMs?: number;
  maxUpdates?: number;
  now?: () => Date;
  random?: () => number;
};

const DEFAULT_LIVE_MIN_INTERVAL_MS = 4_000;
const DEFAULT_LIVE_MAX_INTERVAL_MS = 11_000;
const DEFAULT_LIVE_DURATION_MS = 60_000;

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const filters = ref<TransactionFilters>({ ...defaultFilters });
  const liveEnabled = ref(false);
  const liveEndsAt = ref<string | null>(null);
  const lastAddedTransaction = ref<Transaction | null>(null);
  const liveUpdatesCount = ref(0);
  const liveRemainingSeconds = ref(0);

  let liveUpdateTimer: ReturnType<typeof setTimeout> | null = null;
  let liveStopTimer: ReturnType<typeof setTimeout> | null = null;
  let liveCountdownTimer: ReturnType<typeof setInterval> | null = null;

  const filteredTransactions = computed(() =>
    filterAndSortTransactions(transactions.value, filters.value),
  );

  const isEmpty = computed(() => !loading.value && !error.value && transactions.value.length === 0);
  const hasNoResults = computed(
    () => !loading.value && !error.value && transactions.value.length > 0 && filteredTransactions.value.length === 0,
  );

  const currencyTotals = computed<CurrencyTotal[]>(() =>
    buildCurrencyTotals(filteredTransactions.value),
  );
  const dailyTrend = computed<DailyTrendItem[]>(() => buildDailyTrend(filteredTransactions.value));
  const statusAnalytics = computed<AnalyticsItem<TransactionStatus>[]>(() =>
    buildStatusAnalytics(filteredTransactions.value),
  );
  const typeAnalytics = computed<AnalyticsItem<TransactionType>[]>(() =>
    buildTypeAnalytics(filteredTransactions.value),
  );
  const liveStatusText = computed(() => {
    if (!liveEnabled.value) {
      return 'Live-режим выключен';
    }

    return 'Live-режим включен: новые заявки будут появляться автоматически';
  });
  const liveRemainingText = computed(() => {
    const minutes = Math.floor(liveRemainingSeconds.value / 60);
    const seconds = String(liveRemainingSeconds.value % 60).padStart(2, '0');

    return `${minutes}:${seconds}`;
  });

  function clearLiveTimers() {
    if (liveUpdateTimer) {
      clearTimeout(liveUpdateTimer);
      liveUpdateTimer = null;
    }

    if (liveStopTimer) {
      clearTimeout(liveStopTimer);
      liveStopTimer = null;
    }

    if (liveCountdownTimer) {
      clearInterval(liveCountdownTimer);
      liveCountdownTimer = null;
    }
  }

  function addLiveTransaction(options: Pick<LiveUpdateOptions, 'now' | 'random'> = {}) {
    const transaction = generateLiveTransaction(transactions.value, options);

    transactions.value = [transaction, ...transactions.value];
    lastAddedTransaction.value = transaction;
    liveUpdatesCount.value += 1;

    return transaction;
  }

  function stopLiveUpdates() {
    clearLiveTimers();
    liveEnabled.value = false;
    liveEndsAt.value = null;
    liveRemainingSeconds.value = 0;
  }

  function getNextLiveDelay(minIntervalMs: number, maxIntervalMs: number, random: () => number) {
    const safeMin = Math.max(0, minIntervalMs);
    const safeMax = Math.max(safeMin, maxIntervalMs);

    return Math.round(safeMin + random() * (safeMax - safeMin));
  }

  function scheduleNextLiveUpdate(options: Required<LiveUpdateOptions>) {
    if (!liveEnabled.value) {
      return;
    }

    if (options.maxUpdates > 0 && liveUpdatesCount.value >= options.maxUpdates) {
      stopLiveUpdates();
      return;
    }

    liveUpdateTimer = setTimeout(() => {
      if (!liveEnabled.value) {
        return;
      }

      addLiveTransaction(options);
      scheduleNextLiveUpdate(options);
    }, getNextLiveDelay(options.minIntervalMs, options.maxIntervalMs, options.random));
  }

  function startLiveUpdates(options: LiveUpdateOptions = {}) {
    const liveOptions: Required<LiveUpdateOptions> = {
      minIntervalMs: options.minIntervalMs ?? DEFAULT_LIVE_MIN_INTERVAL_MS,
      maxIntervalMs: options.maxIntervalMs ?? DEFAULT_LIVE_MAX_INTERVAL_MS,
      durationMs: options.durationMs ?? DEFAULT_LIVE_DURATION_MS,
      maxUpdates: options.maxUpdates ?? 0,
      now: options.now ?? (() => new Date()),
      random: options.random ?? Math.random,
    };

    clearLiveTimers();
    liveEnabled.value = true;
    liveEndsAt.value = new Date(Date.now() + liveOptions.durationMs).toISOString();
    liveRemainingSeconds.value = Math.ceil(liveOptions.durationMs / 1000);
    lastAddedTransaction.value = null;
    liveUpdatesCount.value = 0;

    liveCountdownTimer = setInterval(() => {
      liveRemainingSeconds.value = Math.max(0, liveRemainingSeconds.value - 1);
    }, 1_000);

    liveStopTimer = setTimeout(() => {
      stopLiveUpdates();
    }, liveOptions.durationMs);

    scheduleNextLiveUpdate(liveOptions);
  }

  function dismissLiveNotification() {
    lastAddedTransaction.value = null;
  }

  function setSearchQuery(searchQuery: string) {
    filters.value.searchQuery = searchQuery;
  }

  function setStatusFilter(status: TransactionStatus | 'all') {
    filters.value.status = status;
  }

  function setTypeFilter(type: TransactionType | 'all') {
    filters.value.type = type;
  }

  function setSort(sortField: SortField, sortDirection: SortDirection) {
    filters.value.sortField = sortField;
    filters.value.sortDirection = sortDirection;
  }

  function resetFilters() {
    filters.value = { ...defaultFilters };
  }

  function findById(id: string) {
    return transactions.value.find((transaction) => transaction.id === id);
  }

  async function loadTransactions(options: { shouldFail?: boolean; delayMs?: number } = {}) {
    loading.value = true;
    error.value = null;
    stopLiveUpdates();
    lastAddedTransaction.value = null;

    try {
      transactions.value = await fetchTransactions(options);
    } catch (cause) {
      transactions.value = [];
      error.value = cause instanceof Error ? cause.message : 'Не удалось загрузить операции.';
    } finally {
      loading.value = false;
    }
  }

  return {
    transactions,
    loading,
    error,
    filters,
    liveEnabled,
    liveEndsAt,
    lastAddedTransaction,
    liveUpdatesCount,
    liveRemainingSeconds,
    filteredTransactions,
    isEmpty,
    hasNoResults,
    currencyTotals,
    dailyTrend,
    statusAnalytics,
    typeAnalytics,
    liveStatusText,
    liveRemainingText,
    setSearchQuery,
    setStatusFilter,
    setTypeFilter,
    setSort,
    resetFilters,
    findById,
    loadTransactions,
    addLiveTransaction,
    startLiveUpdates,
    stopLiveUpdates,
    dismissLiveNotification,
  };
});
