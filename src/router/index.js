import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MapView from '../views/MapView.vue'
import DetailView from '../views/DetailView.vue'
import BoardView from '../views/BoardView.vue'
import MypageView from '../views/MyPageView.vue'
import CalendarView from '../views/CalendarView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/map',
    name: 'map',
    component: MapView,
  },
  {
    path: '/detail/:spotId',
    name: 'detail',
    component: DetailView,
    props: true,
  },
  {
    path: '/calendar/:spotId',
    name: 'calendar',
    component: CalendarView,
    props: true,
  },
  {
    path: '/board',
    name: 'board',
    component: BoardView,
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: MypageView,
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
