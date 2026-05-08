<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import StateBlock from '@/components/StateBlock.vue';
import TransactionFilters from '@/components/TransactionFilters.vue';
import TransactionTable from '@/components/TransactionTable.vue';
import { useTransactionsStore } from '@/stores/transactions';
import { formatMoney } from '@/utils/format';

const store = useTransactionsStore();
const { error, filteredTransactions, filters, hasNoResults, isEmpty, loading, totalAmount } =
  storeToRefs(store);

onMounted(() => {
  if (!store.transactions.length && !store.loading) {
    void store.loadTransactions();
  }
});
</script>

<template>
  <main class="page-shell">
    <header class="page-header">
      <div>
        <p class="eyebrow">Fintech operations</p>
        <h1>Transaction Dashboard</h1>
        <p class="lead">Monitor deposits, withdrawals, transfers and payments in one compact view.</p>
      </div>

      <div class="header-actions">
        <button type="button" class="secondary-button" @click="store.loadTransactions()">
          Reload
        </button>
        <button
          type="button"
          class="danger-button"
          @click="store.loadTransactions({ shouldFail: true })"
        >
          Simulate error
        </button>
      </div>
    </header>

    <section class="metrics" aria-label="Dashboard summary">
      <article>
        <span>Total shown</span>
        <strong>{{ filteredTransactions.length }}</strong>
      </article>
      <article>
        <span>Volume shown</span>
        <strong>{{ formatMoney(totalAmount, 'USD') }}</strong>
      </article>
      <article>
        <span>Sort</span>
        <strong>{{ filters.sortField }} / {{ filters.sortDirection }}</strong>
      </article>
    </section>

    <section class="panel">
      <TransactionFilters
        :filters="filters"
        @search="store.setSearchQuery"
        @status="store.setStatusFilter"
        @type="store.setTypeFilter"
        @sort="store.setSort"
        @reset="store.resetFilters"
      />
    </section>

    <StateBlock
      v-if="loading"
      title="Loading transactions"
      description="Mock API delay is enabled to demonstrate loading state."
    />

    <StateBlock
      v-else-if="error"
      title="Unable to load transactions"
      :description="error"
    >
      <button type="button" class="primary-button" @click="store.loadTransactions()">Try again</button>
    </StateBlock>

    <StateBlock
      v-else-if="isEmpty"
      title="No transactions yet"
      description="The API returned an empty data set."
    />

    <StateBlock
      v-else-if="hasNoResults"
      title="No matching transactions"
      description="Adjust filters or reset them to return to the full operations list."
    >
      <button type="button" class="primary-button" @click="store.resetFilters()">Reset filters</button>
    </StateBlock>

    <TransactionTable v-else :transactions="filteredTransactions" />
  </main>
</template>

<style scoped>
.page-shell {
  display: grid;
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 42px 0 56px;
  gap: 22px;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #0f172a;
  font-size: 34px;
  line-height: 1.12;
}

.lead {
  max-width: 660px;
  margin: 10px 0 0;
  color: #64748b;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.metrics article,
.panel {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 45px rgb(15 23 42 / 0.05);
}

.metrics article {
  display: grid;
  gap: 8px;
  padding: 18px;
}

.metrics span {
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.metrics strong {
  color: #0f172a;
  font-size: 24px;
  line-height: 1;
}

.panel {
  padding: 18px;
}

.primary-button,
.secondary-button,
.danger-button {
  min-height: 40px;
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  padding: 8px 14px;
}

.primary-button {
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.secondary-button {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
}

.danger-button {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #991b1b;
}

.primary-button:hover {
  background: #1d4ed8;
}

.secondary-button:hover {
  background: #f8fafc;
}

.danger-button:hover {
  background: #fee2e2;
}

button:focus-visible {
  outline: 3px solid #bfdbfe;
  outline-offset: 1px;
}

@media (max-width: 900px) {
  .page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .metrics {
    grid-template-columns: 1fr;
  }
}
</style>

