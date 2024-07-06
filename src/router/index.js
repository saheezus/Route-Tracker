import { createRouter, createWebHistory } from 'vue-router'
import DistanceCalc from '@/views/DistanceCalc.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'DistanceCalc',
      component: DistanceCalc
    },
  ]
})

export default router
