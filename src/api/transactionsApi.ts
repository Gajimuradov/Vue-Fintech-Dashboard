import { transactions } from '@/data/transactions';
import type { Transaction } from '@/types/transaction';

type FetchTransactionsOptions = {
  delayMs?: number;
  shouldFail?: boolean;
};

const DEFAULT_DELAY_MS = 450;

export async function fetchTransactions({
  delayMs = DEFAULT_DELAY_MS,
  shouldFail = false,
}: FetchTransactionsOptions = {}): Promise<Transaction[]> {
  await new Promise((resolve) => globalThis.setTimeout(resolve, delayMs));

  if (shouldFail) {
    throw new Error('Mock API failed to load transactions.');
  }

  return structuredClone(transactions);
}
