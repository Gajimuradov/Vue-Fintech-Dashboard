<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import StatusBadge from '@/components/StatusBadge.vue';
import StateBlock from '@/components/StateBlock.vue';
import { useTransactionsStore } from '@/stores/transactions';
import { formatDate, formatMoney } from '@/utils/format';

const route = useRoute();
const router = useRouter();
const store = useTransactionsStore();
const { loading, error } = storeToRefs(store);

const transactionId = computed(() => String(route.params.id));
const transaction = computed(() => store.findById(transactionId.value));

onMounted(() => {
  if (!store.transactions.length && !store.loading) {
    void store.loadTransactions();
  }
});
</script>

<template>
  <main class="page-shell">
    <button class="back-button" type="button" @click="router.back()">Back</button>

    <StateBlock
      v-if="loading"
      title="Loading operation"
      description="Transaction details are being loaded from mock API."
    />

    <StateBlock
      v-else-if="error"
      title="Unable to load operation"
      :description="error"
    />

    <StateBlock
      v-else-if="!transaction"
      title="Transaction not found"
      description="The requested operation id does not exist in mock data."
    />

    <section v-else class="detail-layout">
      <article class="summary-card">
        <div class="summary-top">
          <div>
            <p class="eyebrow">Operation detail</p>
            <h1>{{ transaction.id }}</h1>
          </div>
          <StatusBadge :status="transaction.status" />
        </div>

        <dl class="detail-grid">
          <div>
            <dt>User</dt>
            <dd>{{ transaction.userName }}</dd>
          </div>
          <div>
            <dt>Amount</dt>
            <dd>{{ formatMoney(transaction.amount, transaction.currency) }}</dd>
          </div>
          <div>
            <dt>Currency</dt>
            <dd>{{ transaction.currency }}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{{ transaction.type }}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{{ formatDate(transaction.createdAt) }}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{{ transaction.status }}</dd>
          </div>
        </dl>
      </article>

      <article class="history-card">
        <h2>Status history</h2>
        <ol class="timeline">
          <li v-for="item in transaction.statusHistory" :key="`${item.status}-${item.changedAt}`">
            <div class="timeline-dot" aria-hidden="true"></div>
            <div>
              <div class="history-head">
                <StatusBadge :status="item.status" />
                <time :datetime="item.changedAt">{{ formatDate(item.changedAt) }}</time>
              </div>
              <p class="history-meta">{{ item.changedBy }}</p>
              <p>{{ item.note }}</p>
            </div>
          </li>
        </ol>
      </article>
    </section>
  </main>
</template>

<style scoped>
.page-shell {
  display: grid;
  width: min(980px, calc(100% - 48px));
  margin: 0 auto;
  padding: 42px 0 56px;
  gap: 18px;
}

.back-button {
  justify-self: start;
  min-height: 40px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #0f172a;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  padding: 8px 14px;
}

.back-button:hover {
  background: #f8fafc;
}

.detail-layout {
  display: grid;
  gap: 18px;
}

.summary-card,
.history-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 45px rgb(15 23 42 / 0.06);
}

.summary-card {
  padding: 24px;
}

.summary-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  color: #0f172a;
  font-size: 32px;
  line-height: 1.12;
}

h2 {
  color: #0f172a;
  font-size: 20px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 0;
}

.detail-grid div {
  display: grid;
  gap: 6px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
}

dt {
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

dd {
  margin: 0;
  color: #0f172a;
  font-size: 16px;
  font-weight: 800;
  text-transform: capitalize;
}

.history-card {
  display: grid;
  gap: 18px;
  padding: 24px;
}

.timeline {
  display: grid;
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline li {
  display: grid;
  grid-template-columns: 14px 1fr;
  gap: 14px;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  margin-top: 8px;
  border-radius: 999px;
  background: #2563eb;
}

.history-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

time,
.history-meta {
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.timeline p:not(.history-meta) {
  color: #334155;
  line-height: 1.6;
}

button:focus-visible {
  outline: 3px solid #bfdbfe;
  outline-offset: 1px;
}

@media (max-width: 760px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .summary-top,
  .history-head {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

