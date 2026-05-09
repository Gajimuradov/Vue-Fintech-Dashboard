import type { Transaction } from '@/types/transaction';

type FetchTransactionsOptions = {
  delayMs?: number;
  shouldFail?: boolean;
};

const API_ORIGIN = globalThis.location?.origin ?? 'http://localhost';

export async function fetchTransactions({
  delayMs,
  shouldFail = false,
}: FetchTransactionsOptions = {}): Promise<Transaction[]> {
  const url = new URL('/api/transactions', API_ORIGIN);

  if (typeof delayMs === 'number') {
    url.searchParams.set('delayMs', String(delayMs));
  }

  if (shouldFail) {
    url.searchParams.set('scenario', 'error');
  }

  const response = await fetch(url);

  if (!response.ok) {
    const fallbackMessage = 'Не удалось загрузить операции.';
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    throw new Error(payload?.message ?? fallbackMessage);
  }

  return (await response.json()) as Transaction[];
}
