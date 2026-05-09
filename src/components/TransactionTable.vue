<script setup lang="ts">
import { RouterLink } from 'vue-router';

import StatusBadge from '@/components/StatusBadge.vue';
import type { Transaction } from '@/types/transaction';
import { formatDate, formatMoney } from '@/utils/format';
import { typeLabels } from '@/utils/labels';

defineProps<{
  transactions: Transaction[];
}>();
</script>

<template>
  <div class="table-shell">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Клиент</th>
          <th>Тип</th>
          <th>Статус</th>
          <th>Сумма</th>
          <th>Создана</th>
          <th aria-label="Действия"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td>
            <span class="mono">{{ transaction.id }}</span>
          </td>
          <td>{{ transaction.userName }}</td>
          <td>{{ typeLabels[transaction.type] }}</td>
          <td>
            <StatusBadge :status="transaction.status" />
          </td>
          <td class="amount">{{ formatMoney(transaction.amount, transaction.currency) }}</td>
          <td>{{ formatDate(transaction.createdAt) }}</td>
          <td class="action-cell">
            <RouterLink class="details-link" :to="`/transactions/${transaction.id}`">
              Открыть
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-shell {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 14px 36px rgb(15 23 42 / 0.04);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 920px;
}

thead {
  background: #f8fafc;
  box-shadow: inset 0 -1px 0 #e2e8f0;
}

th,
td {
  padding: 15px 16px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  white-space: nowrap;
}

th {
  color: #475569;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

tbody tr:last-child td {
  border-bottom: 0;
}

tbody tr:hover {
  background: #f6faf9;
}

.mono {
  display: inline-flex;
  border-radius: 6px;
  background: #f1f5f9;
  color: #334155;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  font-weight: 700;
  padding: 4px 7px;
}

.capitalize {
  text-transform: capitalize;
}

.amount {
  color: #0f172a;
  font-weight: 800;
}

.action-cell {
  text-align: right;
}

.details-link {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  border: 1px solid #ccfbf1;
  border-radius: 8px;
  background: #f0fdfa;
  color: #0f766e;
  font-weight: 800;
  padding: 6px 10px;
  text-decoration: none;
}

.details-link:hover {
  border-color: #99f6e4;
  background: #ccfbf1;
}
</style>
