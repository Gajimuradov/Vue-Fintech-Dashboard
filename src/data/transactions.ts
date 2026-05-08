import type { Transaction } from '@/types/transaction';

export const transactions: Transaction[] = [
  {
    id: 'TRX-1001',
    amount: 1250,
    currency: 'USD',
    status: 'completed',
    type: 'deposit',
    createdAt: '2026-05-07T10:32:00.000Z',
    userName: 'Anna Petrova',
    statusHistory: [
      {
        status: 'pending',
        changedAt: '2026-05-07T10:30:00.000Z',
        changedBy: 'Risk Engine',
        note: 'Deposit request received and queued for screening.',
      },
      {
        status: 'completed',
        changedAt: '2026-05-07T10:32:00.000Z',
        changedBy: 'Settlement Service',
        note: 'Funds settled successfully.',
      },
    ],
  },
  {
    id: 'TRX-1002',
    amount: 420,
    currency: 'EUR',
    status: 'pending',
    type: 'transfer',
    createdAt: '2026-05-07T08:15:00.000Z',
    userName: 'Mark Davies',
    statusHistory: [
      {
        status: 'pending',
        changedAt: '2026-05-07T08:15:00.000Z',
        changedBy: 'Transfer Gateway',
        note: 'Transfer awaits correspondent bank confirmation.',
      },
    ],
  },
  {
    id: 'TRX-1003',
    amount: 88.49,
    currency: 'USD',
    status: 'failed',
    type: 'payment',
    createdAt: '2026-05-06T21:08:00.000Z',
    userName: 'Sophia Nguyen',
    statusHistory: [
      {
        status: 'pending',
        changedAt: '2026-05-06T21:06:00.000Z',
        changedBy: 'Payment Gateway',
        note: 'Card payment authorization started.',
      },
      {
        status: 'failed',
        changedAt: '2026-05-06T21:08:00.000Z',
        changedBy: 'Issuer Bank',
        note: 'Issuer declined the payment.',
      },
    ],
  },
  {
    id: 'TRX-1004',
    amount: 980.75,
    currency: 'GBP',
    status: 'completed',
    type: 'withdrawal',
    createdAt: '2026-05-06T14:44:00.000Z',
    userName: 'Ivan Smirnov',
    statusHistory: [
      {
        status: 'pending',
        changedAt: '2026-05-06T14:40:00.000Z',
        changedBy: 'Payout Service',
        note: 'Withdrawal request passed balance checks.',
      },
      {
        status: 'completed',
        changedAt: '2026-05-06T14:44:00.000Z',
        changedBy: 'Payout Service',
        note: 'Withdrawal sent to external account.',
      },
    ],
  },
  {
    id: 'TRX-1005',
    amount: 2400,
    currency: 'USD',
    status: 'completed',
    type: 'transfer',
    createdAt: '2026-05-05T16:20:00.000Z',
    userName: 'Elena Garcia',
    statusHistory: [
      {
        status: 'pending',
        changedAt: '2026-05-05T16:10:00.000Z',
        changedBy: 'Transfer Gateway',
        note: 'Beneficiary details validated.',
      },
      {
        status: 'completed',
        changedAt: '2026-05-05T16:20:00.000Z',
        changedBy: 'Settlement Service',
        note: 'Transfer completed through internal ledger.',
      },
    ],
  },
  {
    id: 'TRX-1006',
    amount: 65.3,
    currency: 'EUR',
    status: 'pending',
    type: 'payment',
    createdAt: '2026-05-05T09:05:00.000Z',
    userName: 'Noah Wilson',
    statusHistory: [
      {
        status: 'pending',
        changedAt: '2026-05-05T09:05:00.000Z',
        changedBy: 'Payment Gateway',
        note: 'Payment is waiting for 3DS confirmation.',
      },
    ],
  },
  {
    id: 'TRX-1007',
    amount: 710,
    currency: 'USD',
    status: 'completed',
    type: 'deposit',
    createdAt: '2026-05-04T12:35:00.000Z',
    userName: 'Mia Johnson',
    statusHistory: [
      {
        status: 'pending',
        changedAt: '2026-05-04T12:32:00.000Z',
        changedBy: 'Risk Engine',
        note: 'Deposit matched known customer profile.',
      },
      {
        status: 'completed',
        changedAt: '2026-05-04T12:35:00.000Z',
        changedBy: 'Settlement Service',
        note: 'Deposit was credited to the wallet.',
      },
    ],
  },
  {
    id: 'TRX-1008',
    amount: 340.2,
    currency: 'GBP',
    status: 'failed',
    type: 'withdrawal',
    createdAt: '2026-05-03T17:55:00.000Z',
    userName: 'Daniel Lee',
    statusHistory: [
      {
        status: 'pending',
        changedAt: '2026-05-03T17:50:00.000Z',
        changedBy: 'Payout Service',
        note: 'Withdrawal request accepted.',
      },
      {
        status: 'failed',
        changedAt: '2026-05-03T17:55:00.000Z',
        changedBy: 'Compliance Service',
        note: 'Withdrawal stopped because extra review is required.',
      },
    ],
  },
];

