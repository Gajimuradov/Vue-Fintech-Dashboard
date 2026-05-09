<script setup lang="ts">
import type { TransactionStatus, TransactionType } from '@/types/transaction';
import type { AnalyticsItem, CurrencyTotal, DailyTrendItem } from '@/utils/analytics';
import { formatMoney } from '@/utils/format';

defineProps<{
  statusItems: AnalyticsItem<TransactionStatus>[];
  typeItems: AnalyticsItem<TransactionType>[];
  currencyTotals: CurrencyTotal[];
  dailyItems: DailyTrendItem[];
}>();

function hasTotals(totals: CurrencyTotal[]) {
  return totals.length > 0;
}
</script>

<template>
  <section class="analytics" aria-label="Аналитика по операциям">
    <article>
      <div class="section-head">
        <span>Динамика</span>
        <h2>Операции по дням</h2>
      </div>

      <div class="daily-list" aria-label="График дневной динамики операций">
        <div v-for="item in dailyItems" :key="item.date" class="daily-row">
          <time :datetime="item.date">{{ item.label }}</time>
          <div class="daily-track" aria-hidden="true">
            <span :style="{ width: `${item.percentage}%` }"></span>
          </div>
          <strong>{{ item.count }}</strong>
        </div>
      </div>
    </article>

    <article>
      <div class="section-head">
        <span>Валюты</span>
        <h2>Объем в выборке</h2>
      </div>

      <ul class="currency-list">
        <li v-for="item in currencyTotals" :key="item.currency">
          <strong>{{ item.currency }}</strong>
          <span>{{ item.count }} шт.</span>
          <b>{{ formatMoney(item.amount, item.currency) }}</b>
        </li>
      </ul>
    </article>

    <article>
      <div class="section-head">
        <span>Статусы</span>
        <h2>Как идут операции</h2>
      </div>

      <ul class="analytics-list">
        <li v-for="item in statusItems" :key="item.key">
          <div class="row-head">
            <strong>{{ item.label }}</strong>
            <span>{{ item.count }} шт.</span>
          </div>
          <div class="bar" aria-hidden="true">
            <span :style="{ width: `${item.percentage}%` }"></span>
          </div>
          <div class="row-foot">
            <span>{{ item.percentage }}%</span>
            <span v-if="!hasTotals(item.totals)">0</span>
            <span v-else class="totals">
              <span v-for="total in item.totals" :key="total.currency">
                {{ formatMoney(total.amount, total.currency) }}
              </span>
            </span>
          </div>
        </li>
      </ul>
    </article>

    <article>
      <div class="section-head">
        <span>Типы</span>
        <h2>Структура потока</h2>
      </div>

      <ul class="analytics-list">
        <li v-for="item in typeItems" :key="item.key">
          <div class="row-head">
            <strong>{{ item.label }}</strong>
            <span>{{ item.count }} шт.</span>
          </div>
          <div class="bar" aria-hidden="true">
            <span :style="{ width: `${item.percentage}%` }"></span>
          </div>
          <div class="row-foot">
            <span>{{ item.percentage }}%</span>
            <span v-if="!hasTotals(item.totals)">0</span>
            <span v-else class="totals">
              <span v-for="total in item.totals" :key="total.currency">
                {{ formatMoney(total.amount, total.currency) }}
              </span>
            </span>
          </div>
        </li>
      </ul>
    </article>
  </section>
</template>

<style scoped>
.analytics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

article {
  display: grid;
  gap: 18px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 45px rgb(15 23 42 / 0.05);
  padding: 18px;
}

.section-head {
  display: grid;
  gap: 6px;
}

.section-head span {
  color: #2563eb;
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

.analytics-list {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.analytics-list li {
  display: grid;
  gap: 8px;
}

.daily-list {
  display: grid;
  gap: 12px;
}

.daily-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 28px;
  gap: 12px;
  align-items: center;
}

.daily-row strong {
  color: #0f172a;
  font-size: 14px;
  text-align: right;
}

.daily-track {
  overflow: hidden;
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
}

.daily-track span {
  display: block;
  height: 100%;
  min-width: 3px;
  border-radius: inherit;
  background: #2563eb;
}

time {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}

.currency-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.currency-list li {
  display: grid;
  grid-template-columns: 64px 64px 1fr;
  gap: 12px;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
}

.currency-list strong,
.currency-list b {
  color: #0f172a;
}

.currency-list span {
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.currency-list b {
  justify-self: end;
}

.row-head,
.row-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.row-head strong {
  color: #0f172a;
  font-size: 14px;
}

.row-head span,
.row-foot {
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.totals {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px 10px;
}

.bar {
  overflow: hidden;
  height: 8px;
  border-radius: 999px;
  background: #e2e8f0;
}

.bar span {
  display: block;
  height: 100%;
  min-width: 2px;
  border-radius: inherit;
  background: #2563eb;
}

@media (max-width: 900px) {
  .analytics {
    grid-template-columns: 1fr;
  }
}
</style>
