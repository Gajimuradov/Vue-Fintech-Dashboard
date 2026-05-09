<script setup lang="ts">
import type { TransactionStatus, TransactionType } from '@/types/transaction';
import type { AnalyticsItem } from '@/utils/analytics';
import { formatMoney } from '@/utils/format';

defineProps<{
  statusItems: AnalyticsItem<TransactionStatus>[];
  typeItems: AnalyticsItem<TransactionType>[];
}>();
</script>

<template>
  <section class="analytics" aria-label="Аналитика по операциям">
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
            <span>{{ formatMoney(item.amount, 'USD') }}</span>
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
            <span>{{ formatMoney(item.amount, 'USD') }}</span>
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

li {
  display: grid;
  gap: 8px;
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

