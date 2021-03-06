import Vue from 'vue'
import VueRouter from 'vue-router'
import TaskListPage from '../views/TaskListPage.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

// const test = (to, from, next) => {
//   console.log(to)
//   console.log(from)
//   console.log(next)
//   next()
// }

const routes = [
  {
    path: '/',
    name: 'TaskListPage',
    component: TaskListPage
  },
  {
    path: '/edit/:taskId/:taskView',
    name: 'EditTaskPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "edit" */ '../views/EditTaskPage.vue'),
    // beforeEnter: test
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
