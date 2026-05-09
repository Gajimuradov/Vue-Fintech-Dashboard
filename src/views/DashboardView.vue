<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

import OperationAnalytics from '@/components/OperationAnalytics.vue';
import StateBlock from '@/components/StateBlock.vue';
import TransactionFilters from '@/components/TransactionFilters.vue';
import TransactionTable from '@/components/TransactionTable.vue';
import { useTransactionsStore } from '@/stores/transactions';
import { formatMoney } from '@/utils/format';
import { sortLabels } from '@/utils/labels';

const store = useTransactionsStore();
const {
  error,
  filteredTransactions,
  filters,
  hasNoResults,
  isEmpty,
  loading,
  currencyTotals,
  dailyTrend,
  statusAnalytics,
  typeAnalytics,
} = storeToRefs(store);

const currentSortLabel = computed(
  () => sortLabels[`${filters.value.sortField}:${filters.value.sortDirection}`],
);

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
        <p class="eyebrow">Финтех-операции</p>
        <h1>Панель операций</h1>
        <p class="lead">Быстрый обзор платежей, переводов, пополнений и выводов без лишнего шума.</p>
      </div>

      <div class="header-actions">
        <button type="button" class="secondary-button" @click="store.loadTransactions()">
          Обновить
        </button>
        <button
          type="button"
          class="danger-button"
          @click="store.loadTransactions({ shouldFail: true })"
        >
          Показать ошибку
        </button>
      </div>
    </header>

    <section class="metrics" aria-label="Сводка по операциям">
      <article>
        <span>Найдено</span>
        <strong>{{ filteredTransactions.length }}</strong>
      </article>
      <article>
        <span>Объем по валютам</span>
        <div class="currency-summary">
          <strong v-for="item in currencyTotals" :key="item.currency">
            {{ formatMoney(item.amount, item.currency) }}
          </strong>
        </div>
      </article>
      <article>
        <span>Порядок</span>
        <strong>{{ currentSortLabel }}</strong>
      </article>
    </section>

    <OperationAnalytics
      v-if="!loading && !error && !isEmpty && !hasNoResults"
      :status-items="statusAnalytics"
      :type-items="typeAnalytics"
      :currency-totals="currencyTotals"
      :daily-items="dailyTrend"
    />

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
      title="Загружаем операции"
      description="Mock API специально отвечает с небольшой задержкой, чтобы было видно состояние загрузки."
    />

    <StateBlock
      v-else-if="error"
      title="Операции не загрузились"
      :description="error"
    >
      <button type="button" class="primary-button" @click="store.loadTransactions()">Попробовать еще раз</button>
    </StateBlock>

    <StateBlock
      v-else-if="isEmpty"
      title="Операций пока нет"
      description="Mock API вернул пустой список. Для реального продукта здесь был бы первый чистый экран."
    />

    <StateBlock
      v-else-if="hasNoResults"
      title="Ничего не найдено"
      description="Таких операций в списке нет. Измените фильтры или вернитесь к полной выборке."
    >
      <button type="button" class="primary-button" @click="store.resetFilters()">Сбросить фильтры</button>
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

.currency-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
}

.currency-summary strong {
  font-size: 18px;
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
