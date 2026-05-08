import { createRouter, createWebHistory } from 'vue-router';

import DashboardView from '@/views/DashboardView.vue';
import TransactionDetailView from '@/views/TransactionDetailView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/transactions/:id',
      name: 'transaction-detail',
      component: TransactionDetailView,
      props: true,
    },
  ],
});

export default router;

