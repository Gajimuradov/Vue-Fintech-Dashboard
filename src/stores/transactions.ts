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
import { defaultFilters, filterAndSortTransactions } from '@/utils/transactions';

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const filters = ref<TransactionFilters>({ ...defaultFilters });

  const filteredTransactions = computed(() =>
    filterAndSortTransactions(transactions.value, filters.value),
  );

  const isEmpty = computed(() => !loading.value && !error.value && transactions.value.length === 0);
  const hasNoResults = computed(
    () => !loading.value && !error.value && transactions.value.length > 0 && filteredTransactions.value.length === 0,
  );

  const totalAmount = computed(() =>
    filteredTransactions.value.reduce((sum, transaction) => sum + transaction.amount, 0),
  );

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

    try {
      transactions.value = await fetchTransactions(options);
    } catch (cause) {
      transactions.value = [];
      error.value = cause instanceof Error ? cause.message : 'Failed to load transactions.';
    } finally {
      loading.value = false;
    }
  }

  return {
    transactions,
    loading,
    error,
    filters,
    filteredTransactions,
    isEmpty,
    hasNoResults,
    totalAmount,
    setSearchQuery,
    setStatusFilter,
    setTypeFilter,
    setSort,
    resetFilters,
    findById,
    loadTransactions,
  };
});

