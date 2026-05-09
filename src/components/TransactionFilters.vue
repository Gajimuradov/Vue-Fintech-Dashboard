<script setup lang="ts">
import type {
  SortDirection,
  SortField,
  TransactionFilters,
  TransactionStatus,
  TransactionType,
} from '@/types/transaction';
import { sortLabels, statusLabels, typeLabels } from '@/utils/labels';

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
const statusFilterLabels: Record<TransactionStatus | 'all', string> = {
  all: 'Все статусы',
  ...statusLabels,
};
const typeFilterLabels: Record<TransactionType | 'all', string> = {
  all: 'Все типы',
  ...typeLabels,
};

function handleSortChange(value: string) {
  const [field, direction] = value.split(':') as [SortField, SortDirection];
  emit('sort', field, direction);
}
</script>

<template>
  <section class="filters" aria-label="Фильтры операций">
    <label class="field search-field">
      <span>Поиск</span>
      <input
        :value="filters.searchQuery"
        type="search"
        placeholder="Имя клиента или id операции"
        aria-label="Поиск по имени клиента или id операции"
        @input="emit('search', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <label class="field">
      <span>Статус</span>
      <select
        :value="filters.status"
        aria-label="Фильтр по статусу"
        @change="emit('status', ($event.target as HTMLSelectElement).value as TransactionStatus | 'all')"
      >
        <option v-for="status in statuses" :key="status" :value="status">
          {{ statusFilterLabels[status] }}
        </option>
      </select>
    </label>

    <label class="field">
      <span>Тип</span>
      <select
        :value="filters.type"
        aria-label="Фильтр по типу операции"
        @change="emit('type', ($event.target as HTMLSelectElement).value as TransactionType | 'all')"
      >
        <option v-for="type in types" :key="type" :value="type">
          {{ typeFilterLabels[type] }}
        </option>
      </select>
    </label>

    <label class="field">
      <span>Сортировка</span>
      <select
        :value="`${filters.sortField}:${filters.sortDirection}`"
        aria-label="Сортировка операций"
        @change="handleSortChange(($event.target as HTMLSelectElement).value)"
      >
        <option value="createdAt:desc">{{ sortLabels['createdAt:desc'] }}</option>
        <option value="createdAt:asc">{{ sortLabels['createdAt:asc'] }}</option>
        <option value="amount:desc">{{ sortLabels['amount:desc'] }}</option>
        <option value="amount:asc">{{ sortLabels['amount:asc'] }}</option>
      </select>
    </label>

    <button class="secondary-button" type="button" @click="emit('reset')">Сбросить</button>
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
