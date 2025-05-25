import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MapView from '../views/MapView.vue'
import PostView from '../views/PostView.vue'
import BoardView from '../views/BoardView.vue'
import MypageView from '../views/MyPageView.vue'
import CalendarView from '../views/CalendarView.vue'
import NearbyAttractions from '../views/NearbyAttractions.vue'
import PostCreateView from '@/views/PostCreateView.vue'
import PostEditView from '../views/PostEditView.vue'

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
    path: '/board/:id',
    name: 'detail',
    component: PostView,
    props: true,
  },
  {
    path: '/calendar/:spotId',
    name: 'CalendarView',
    component: CalendarView,
    props: true,
  },
  {
    path: '/board',
    name: 'board',
    component: BoardView,
  },
  {
    path: '/board/create',
    name: 'createPost',
    component: PostCreateView,
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: MypageView,
  },
  {
    path: '/nearby',
    name: 'NearbyAttractions',
    component: NearbyAttractions,
  },
  {
  path: '/board/edit/:id',
  name: 'BoardEdit',
  component: PostEditView,
  meta: { requiresAuth: true } // 선택
},

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
