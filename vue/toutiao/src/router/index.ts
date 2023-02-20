import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Login = () => require('../views/Login.vue')
const Layout = () => require('../views/Layout.vue')
const Home = () => require('../views/Home/index.vue')
const Qa = () => require('../views/Qa.vue')
const Video = () => require('../views/Video.vue')
const Mine = () => require('../views/Mine/index.vue')
const Search = () => require('../views/Home/Search.vue')
const Profile = () => require('../views/Mine/Profile.vue')
const Setting = () => require('../views/Mine/Setting.vue')
const History = () => require('../views/Mine/History.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: Home
      },
      {
        path: '/qa',
        component: Qa
      },
      {
        path: '/video',
        component: Video
      },
      {
        path: '/mine',
        component: Mine
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/user/profile',
    component: Profile
  },
  {
    path: '/user/setting',
    component: Setting
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
