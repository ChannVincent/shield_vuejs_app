import { createRouter, createWebHistory } from 'vue-router'
import PostListView from '../views/PostListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'PostListView',
      component: PostListView
    },
  ]
})

export default router