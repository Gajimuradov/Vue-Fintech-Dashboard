<script setup lang="ts">
import type {
  SortDirection,
  SortField,
  TransactionFilters,
  TransactionStatus,
  TransactionType,
} from '@/types/transaction';

defineProps<{
  filters: TransactionFilters;
}>();

const emit = defineEmits<{
  search: [value: string];
  status: [value: TransactionStatus | 'all'];
  type: [value: TransactionType | 'all'];
  sort: [field: SortField, direction: SortDirection];
  reset: [];
}>();

const statuses: Array<TransactionStatus | 'all'> = ['all', 'pending', 'completed', 'failed'];
const types: Array<TransactionType | 'all'> = ['all', 'deposit', 'withdrawal', 'payment', 'transfer'];

function handleSortChange(value: string) {
  const [field, direction] = value.split(':') as [SortField, SortDirection];
  emit('sort', field, direction);
}
</script>

<template>
  <section class="filters" aria-label="Transaction filters">
    <label class="field search-field">
      <span>Search</span>
      <input
        :value="filters.searchQuery"
        type="search"
        placeholder="User name or transaction id"
        aria-label="Search by user name or transaction id"
        @input="emit('search', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <label class="field">
      <span>Status</span>
      <select
        :value="filters.status"
        aria-label="Filter by status"
        @change="emit('status', ($event.target as HTMLSelectElement).value as TransactionStatus | 'all')"
      >
        <option v-for="status in statuses" :key="status" :value="status">
          {{ status }}
        </option>
      </select>
    </label>

    <label class="field">
      <span>Type</span>
      <select
        :value="filters.type"
        aria-label="Filter by type"
        @change="emit('type', ($event.target as HTMLSelectElement).value as TransactionType | 'all')"
      >
        <option v-for="type in types" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </label>

    <label class="field">
      <span>Sort</span>
      <select
        :value="`${filters.sortField}:${filters.sortDirection}`"
        aria-label="Sort transactions"
        @change="handleSortChange(($event.target as HTMLSelectElement).value)"
      >
        <option value="createdAt:desc">Newest first</option>
        <option value="createdAt:asc">Oldest first</option>
        <option value="amount:desc">Amount high to low</option>
        <option value="amount:asc">Amount low to high</option>
      </select>
    </label>

    <button class="secondary-button" type="button" @click="emit('reset')">Reset</button>
  </section>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: minmax(260px, 1.2fr) repeat(3, minmax(150px, 0.7fr)) auto;
  gap: 12px;
  align-items: end;
}

.field {
  display: grid;
  gap: 6px;
}

.field span {
  color: #475569;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

input,
select {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #0f172a;
  font: inherit;
  min-height: 42px;
  padding: 9px 12px;
}

input:focus,
select:focus,
button:focus-visible {
  outline: 3px solid #bfdbfe;
  outline-offset: 1px;
}

.secondary-button {
  min-height: 42px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #0f172a;
  cursor: pointer;
  font-weight: 700;
  padding: 9px 14px;
}

.secondary-button:hover {
  background: #f8fafc;
}

@media (max-width: 1040px) {
  .filters {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }

  .search-field {
    grid-column: 1 / -1;
  }
}
</style>

