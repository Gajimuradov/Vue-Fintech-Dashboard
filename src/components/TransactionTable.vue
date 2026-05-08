<script setup lang="ts">
import { RouterLink } from 'vue-router';

import StatusBadge from '@/components/StatusBadge.vue';
import type { Transaction } from '@/types/transaction';
import { formatDate, formatMoney } from '@/utils/format';

defineProps<{
  transactions: Transaction[];
}>();
</script>

<template>
  <div class="table-shell">
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>User</th>
          <th>Type</th>
          <th>Status</th>
          <th>Amount</th>
          <th>Created</th>
          <th aria-label="Actions"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td class="mono">{{ transaction.id }}</td>
          <td>{{ transaction.userName }}</td>
          <td class="capitalize">{{ transaction.type }}</td>
          <td>
            <StatusBadge :status="transaction.status" />
          </td>
          <td class="amount">{{ formatMoney(transaction.amount, transaction.currency) }}</td>
          <td>{{ formatDate(transaction.createdAt) }}</td>
          <td class="action-cell">
            <RouterLink class="details-link" :to="`/transactions/${transaction.id}`">
              Details
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-shell {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 45px rgb(15 23 42 / 0.06);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead {
  background: #f8fafc;
}

th,
td {
  padding: 14px 16px;
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
  background: #f8fafc;
}

.mono {
  color: #334155;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
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
  color: #2563eb;
  font-weight: 800;
  text-decoration: none;
}

.details-link:hover {
  text-decoration: underline;
}
</style>

