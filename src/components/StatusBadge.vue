<script setup lang="ts">
import type { TransactionStatus } from '@/types/transaction';

defineProps<{
  status: TransactionStatus;
}>();
</script>

<template>
  <span :class="['badge', status]">{{ status }}</span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-width: 86px;
  justify-content: center;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  text-transform: capitalize;
}

.completed {
  background: #dcfce7;
  color: #166534;
}

.pending {
  background: #fef3c7;
  color: #92400e;
}

.failed {
  background: #fee2e2;
  color: #991b1b;
}
</style>

