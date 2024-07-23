import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/requests',
      name: 'requests',
      component: () => import('../views/RequestsPlaygroundView.vue')
    }
    /*
    {
      path: '/rules',
      name: 'rules',
      component: () => import('../views/RulesEditorView.vue')
    }
    */
  ]
});

export default router;
