import type { Transaction, TransactionCurrency, TransactionType } from '@/types/transaction';

const liveUsers = [
  'Daria Volkova',
  'Lucas Martin',
  'Amina Said',
  'Peter Novak',
  'Yuki Tanaka',
  'Nikita Orlov',
];

const liveTypes: TransactionType[] = ['deposit', 'withdrawal', 'payment', 'transfer'];
const liveCurrencies: TransactionCurrency[] = ['USD', 'EUR', 'GBP'];

type GenerateLiveTransactionOptions = {
  now?: () => Date;
  random?: () => number;
};

function pickRandom<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)] ?? items[0];
}

function getNextTransactionId(transactions: Transaction[]): string {
  const maxNumber = transactions.reduce((max, transaction) => {
    const numberPart = Number(transaction.id.replace(/\D/g, ''));

    return Number.isFinite(numberPart) ? Math.max(max, numberPart) : max;
  }, 1000);

  return `TRX-${maxNumber + 1}`;
}

export function generateLiveTransaction(
  transactions: Transaction[],
  { now = () => new Date(), random = Math.random }: GenerateLiveTransactionOptions = {},
): Transaction {
  const createdAt = now().toISOString();
  const type = pickRandom(liveTypes, random);
  const currency = pickRandom(liveCurrencies, random);
  const userName = pickRandom(liveUsers, random);
  const amount = Number((50 + random() * 2450).toFixed(2));

  return {
    id: getNextTransactionId(transactions),
    amount,
    currency,
    status: 'pending',
    type,
    createdAt,
    userName,
    statusHistory: [
      {
        status: 'pending',
        changedAt: createdAt,
        changedBy: 'Live Stream Mock',
        note: 'Новая заявка поступила в live-поток и ожидает обработки.',
      },
    ],
  };
}
