<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted } from 'vue';

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
  lastAddedTransaction,
  liveEnabled,
  liveRemainingText,
  liveStatusText,
  liveUpdatesCount,
  loading,
  currencyTotals,
  dailyTrend,
  statusAnalytics,
  typeAnalytics,
} = storeToRefs(store);

const currentSortLabel = computed(
  () => sortLabels[`${filters.value.sortField}:${filters.value.sortDirection}`],
);

function toggleLiveUpdates() {
  if (store.liveEnabled) {
    store.stopLiveUpdates();
    return;
  }

  store.startLiveUpdates();
}

onMounted(() => {
  if (!store.transactions.length && !store.loading) {
    void store.loadTransactions();
  }
});

onBeforeUnmount(() => {
  store.stopLiveUpdates();
});
</script>

<template>
  <main class="page-shell">
    <header class="page-header">
      <div>
        <p class="eyebrow">Операционный мониторинг</p>
        <h1>Операции и статусы</h1>
        <p class="lead">Рабочий экран для контроля платежей, переводов, пополнений и выводов: быстро найти операцию, увидеть статус и открыть детали без лишних переходов.</p>
        <p class="live-status">
          <span :class="['live-dot', { active: liveEnabled }]"></span>
          {{ liveStatusText }}
          <strong v-if="liveEnabled" class="live-timer">{{ liveRemainingText }}</strong>
        </p>
      </div>

      <div class="header-actions">
        <button
          type="button"
          :class="['live-button', { active: liveEnabled }]"
          :disabled="loading || Boolean(error)"
          @click="toggleLiveUpdates"
        >
          {{ liveEnabled ? 'Остановить Live' : 'Включить Live' }}
        </button>
        <button type="button" class="secondary-button" @click="store.loadTransactions()">
          Обновить данные
        </button>
        <button
          type="button"
          class="danger-button"
          @click="store.loadTransactions({ shouldFail: true })"
        >
          Сымитировать сбой
        </button>
      </div>
    </header>

    <section v-if="lastAddedTransaction" class="live-notice" aria-live="polite">
      <div>
        <span>Новая заявка</span>
        <strong>{{ lastAddedTransaction.id }}</strong>
        <p>
          {{ lastAddedTransaction.userName }} · {{ formatMoney(lastAddedTransaction.amount, lastAddedTransaction.currency) }}
        </p>
      </div>
      <div class="notice-actions">
        <RouterLink class="notice-link" :to="`/transactions/${lastAddedTransaction.id}`">
          Открыть
        </RouterLink>
        <button type="button" @click="store.dismissLiveNotification()">Скрыть</button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <div>
          <p class="section-kicker">Фильтры</p>
          <h2>Найдите нужную операцию</h2>
        </div>
      </div>

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
      description="Получаем список операций и готовим сводку по текущей выборке."
    />

    <StateBlock
      v-else-if="error"
      title="Операции не загрузились"
      :description="error"
    >
      <button type="button" class="primary-button" @click="store.loadTransactions()">Повторить загрузку</button>
    </StateBlock>

    <StateBlock
      v-else-if="isEmpty"
      title="Операций пока нет"
      description="Список пуст. В рабочем продукте здесь можно показать первый шаг или ссылку на создание операции."
    />

    <StateBlock
      v-else-if="hasNoResults"
      title="Ничего не найдено"
      description="В текущей выборке нет операций с такими параметрами. Попробуйте изменить поиск, статус или тип."
    >
      <button type="button" class="primary-button" @click="store.resetFilters()">Сбросить фильтры</button>
    </StateBlock>

    <template v-else>
      <section class="metrics" aria-label="Сводка по операциям">
        <article>
          <span>В выборке</span>
          <strong>{{ filteredTransactions.length }}</strong>
          <small v-if="liveUpdatesCount > 0">+{{ liveUpdatesCount }} из live-потока</small>
        </article>
        <article>
          <span>Оборот по валютам</span>
          <div class="currency-summary">
            <strong v-for="item in currencyTotals" :key="item.currency">
              {{ formatMoney(item.amount, item.currency) }}
            </strong>
          </div>
        </article>
        <article>
          <span>Сортировка</span>
          <strong>{{ currentSortLabel }}</strong>
        </article>
      </section>

      <OperationAnalytics
        :status-items="statusAnalytics"
        :type-items="typeAnalytics"
        :currency-totals="currencyTotals"
        :daily-items="dailyTrend"
      />

      <TransactionTable :transactions="filteredTransactions" />
    </template>
  </main>
</template>

<style scoped>
.page-shell {
  display: grid;
  width: min(1220px, calc(100% - 48px));
  margin: 0 auto;
  padding: 40px 0 56px;
  gap: 18px;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #0f766e;
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
  max-width: 740px;
  margin: 10px 0 0;
  color: #475569;
  line-height: 1.6;
}

.live-status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 14px 0 0;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.live-timer {
  border-radius: 999px;
  background: #ccfbf1;
  color: #134e4a;
  font-variant-numeric: tabular-nums;
  padding: 3px 8px;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #94a3b8;
}

.live-dot.active {
  background: #0f766e;
  box-shadow: 0 0 0 5px rgb(15 118 110 / 0.14);
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
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
  box-shadow: 0 14px 36px rgb(15 23 42 / 0.04);
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
  font-size: 22px;
  line-height: 1;
}

.metrics small {
  color: #0f766e;
  font-size: 12px;
  font-weight: 800;
}

.live-notice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid #99f6e4;
  border-radius: 8px;
  background: #f0fdfa;
  color: #0f172a;
  padding: 14px 16px;
}

.live-notice span {
  color: #0f766e;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.live-notice strong {
  display: block;
  margin-top: 3px;
  font-size: 18px;
}

.live-notice p {
  margin: 3px 0 0;
  color: #475569;
  font-size: 14px;
}

.notice-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notice-link,
.notice-actions button {
  min-height: 34px;
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  padding: 7px 10px;
}

.notice-link {
  border: 1px solid #0f766e;
  background: #0f766e;
  color: #ffffff;
  text-decoration: none;
}

.notice-actions button {
  border: 1px solid #99f6e4;
  background: #ffffff;
  color: #0f766e;
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
  display: grid;
  gap: 16px;
  padding: 18px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.section-kicker {
  margin: 0 0 4px;
  color: #0f766e;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  color: #0f172a;
  font-size: 18px;
  line-height: 1.2;
}

.primary-button,
.live-button,
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
  border: 1px solid #0f766e;
  background: #0f766e;
  color: #ffffff;
}

.live-button {
  border: 1px solid #0f766e;
  background: #0f766e;
  color: #ffffff;
}

.live-button.active {
  border-color: #134e4a;
  background: #134e4a;
}

.live-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.secondary-button {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
}

.danger-button {
  border: 1px solid #fed7aa;
  background: #fff7ed;
  color: #9a3412;
}

.primary-button:hover,
.live-button:hover:not(:disabled) {
  background: #115e59;
}

.secondary-button:hover {
  border-color: #99f6e4;
  background: #f0fdfa;
  color: #0f766e;
}

.danger-button:hover {
  background: #ffedd5;
}

button:focus-visible {
  outline: 3px solid #ccfbf1;
  outline-offset: 1px;
}

@media (max-width: 900px) {
  .page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .header-actions,
  .live-notice,
  .notice-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .metrics {
    grid-template-columns: 1fr;
  }
}
</style>
