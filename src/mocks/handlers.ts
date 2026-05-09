import { delay, http, HttpResponse } from 'msw';

import { transactions } from '@/data/transactions';

const DEFAULT_DELAY_MS = 450;
const ERROR_MESSAGE = 'Не удалось загрузить операции из mock API.';

export const handlers = [
  http.get('*/api/transactions', async ({ request }) => {
    const url = new URL(request.url);
    const delayMs = Number(url.searchParams.get('delayMs') ?? DEFAULT_DELAY_MS);

    await delay(Number.isFinite(delayMs) ? delayMs : DEFAULT_DELAY_MS);

    if (url.searchParams.get('scenario') === 'error') {
      return HttpResponse.json({ message: ERROR_MESSAGE }, { status: 503 });
    }

    return HttpResponse.json(structuredClone(transactions));
  }),
];
