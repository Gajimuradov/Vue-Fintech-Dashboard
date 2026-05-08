import type { Transaction, TransactionFilters } from '@/types/transaction';

export const defaultFilters: TransactionFilters = {
  searchQuery: '',
  status: 'all',
  type: 'all',
  sortField: 'createdAt',
  sortDirection: 'desc',
};

export function filterTransactions(
  transactions: Transaction[],
  filters: Pick<TransactionFilters, 'searchQuery' | 'status' | 'type'>,
): Transaction[] {
  const normalizedQuery = filters.searchQuery.trim().toLowerCase();

  return transactions.filter((transaction) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      transaction.userName.toLowerCase().includes(normalizedQuery) ||
      transaction.id.toLowerCase().includes(normalizedQuery);

    const matchesStatus = filters.status === 'all' || transaction.status === filters.status;
    const matchesType = filters.type === 'all' || transaction.type === filters.type;

    return matchesSearch && matchesStatus && matchesType;
  });
}

export function sortTransactions(
  transactions: Transaction[],
  filters: Pick<TransactionFilters, 'sortField' | 'sortDirection'>,
): Transaction[] {
  const directionModifier = filters.sortDirection === 'asc' ? 1 : -1;

  return [...transactions].sort((first, second) => {
    const firstValue =
      filters.sortField === 'amount' ? first.amount : new Date(first.createdAt).getTime();
    const secondValue =
      filters.sortField === 'amount' ? second.amount : new Date(second.createdAt).getTime();

    return (firstValue - secondValue) * directionModifier;
  });
}

export function filterAndSortTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  return sortTransactions(filterTransactions(transactions, filters), filters);
}

