export type TransactionStatus = 'pending' | 'completed' | 'failed';

export type TransactionType = 'deposit' | 'withdrawal' | 'payment' | 'transfer';

export type TransactionCurrency = 'USD' | 'EUR' | 'GBP';

export type SortField = 'createdAt' | 'amount';

export type SortDirection = 'asc' | 'desc';

export type StatusHistoryItem = {
  status: TransactionStatus;
  changedAt: string;
  changedBy: string;
  note: string;
};

export type Transaction = {
  id: string;
  amount: number;
  currency: TransactionCurrency;
  status: TransactionStatus;
  type: TransactionType;
  createdAt: string;
  userName: string;
  statusHistory: StatusHistoryItem[];
};

export type TransactionFilters = {
  searchQuery: string;
  status: TransactionStatus | 'all';
  type: TransactionType | 'all';
  sortField: SortField;
  sortDirection: SortDirection;
};
