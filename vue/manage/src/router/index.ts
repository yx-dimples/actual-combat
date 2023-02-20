import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Layout from '../views/layout.vue'


const Login = () => require('../views/login.vue')
const Home = () => require('../views/home.vue')
const StudentList = () => require('../views/student/list.vue')
const InfoList = () => require('../views/student/infoList.vue')
const InfoManage = () => require('../views/student/infoManage.vue')
const TaskList = () => require('../views/student/taskList.vue')
const TaskManage = () => require('../views/student/taskManage.vue')
const Overview = () => require('../views/map/overview.vue')
const Analysis = () => require('../views/map/analysis.vue')
const Travel = () => require('../views/map/travel.vue')
const Permission = () => require('../views/permission.vue')


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: {
      title: '系统首页',
      icon: 'fa-institution'
    },
    children: [
      {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
          title: '系统首页',
          icon: 'fa-institution'
        }
      }
    ]
  },
  {
    path: '/student',
    component: Layout,
    redirect: '/student/manage',
    meta: {
      title: '学生管理', 
      icon: 'fa-th-large' 
    },
    children: [
      {
        path: '/student/list',
        name: 'list',
        component: StudentList,
        meta: { title: '学生列表', icon: 'fa-list' }
      },
      {
        path: '/student/info/list',
        name: 'infoList',
        component: InfoList,
        meta: { title: '信息列表', icon: 'fa-list' }
      },
      {
        path: '/student/info/manage',
        name: 'infoManage',
        component: InfoManage,
        meta: { title: '信息管理', icon: 'fa-list' }
      },
      {
        path: '/student/trask/list',
        name: 'traskList',
        component: TaskList,
        meta: { title: '作业列表', icon: 'fa-list' }
      },
      {
        path: '/student/trask/manage',
        name: 'traskManage',
        component: TaskManage,
        meta: { title: '作业管理', icon: 'fa-list' }
      }
    ]
  },
    {
    path: '/data',
    component: Layout,
    redirect: '/data/analysis',
    meta: { title: '数据分析', icon: 'fa-bar-chart' },
    children: [
      {
        path: '/data/overview',
        name: 'overview',
        component: Overview,
        meta: { title: '地图概览', icon: 'fa-line-chart' }
      },
      {
        path: '/data/travel',
        name: 'travel',
        component: Travel,
        meta: { title: '旅游地图', icon: 'fa-line-chart' }
      },
      {
        path: '/data/analysis/map',
        name: 'analysedi',
        component: Analysis,
        meta: { title: '分析地图', icon: 'fa-line-chart'},
      }
    ]
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/center',
    children: [
      {
        path: '/permission/management',
        name: 'permission',
        component: Permission,
        meta: { title: '权限管理', icon: 'fa-user-o' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
