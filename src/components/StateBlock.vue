<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <section class="state-block">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <slot />
  </section>
</template>

<style scoped>
.state-block {
  display: grid;
  min-height: 220px;
  place-items: center;
  align-content: center;
  gap: 12px;
  border: 1px dashed #94a3b8;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 14px 36px rgb(15 23 42 / 0.04);
  color: #475569;
  text-align: center;
  padding: 28px;
}

.state-block h2 {
  margin: 0;
  color: #0f172a;
  font-size: 20px;
  line-height: 1.2;
}

.state-block p {
  max-width: 460px;
  margin: 0;
  line-height: 1.6;
}
</style>
