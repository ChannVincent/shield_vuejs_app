import { createRouter, createWebHistory } from 'vue-router'
import PostListView from '../views/PostListView.vue'
import LoginView from '../views/LoginView.vue'


const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'PostListView',
      component: PostListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'LoginView',
      component: LoginView
    },
  ]
});


// Global Navigation Guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    // Redirect to login if not authenticated
    next('/login');
  } else {
    next(); // Proceed to the route
  }
});


export default router;