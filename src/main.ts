import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import './styles/global.css';

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import('@/mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

void enableMocking().then(() => {
  createApp(App).use(createPinia()).use(router).mount('#app');
});
