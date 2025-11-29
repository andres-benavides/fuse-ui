import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import TicketsView from '../views/TicketsView.vue';
import RegisterView from '../views/RegisterView.vue';

const routes = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/tickets', name: 'tickets', component: TicketsView },
  { path: '/register', name: 'register', component: RegisterView},
  { path: '/:pathMatch(.*)*', redirect: '/login' },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const user = localStorage.getItem('user');

  if (authRequired && !user) {
    return next('/login');
  }

  next();
});

export default router;
