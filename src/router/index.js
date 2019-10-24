import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index', name: 'index', component: Index },
  { path: '/login', name: 'login', component: Login }

]

const router = new VueRouter({
  routes
})

// to 到哪去
// from 从哪来
// next 是否放行  next() 放行    next('/login') 拦截到登录
// 如果准备去登录, 不需要拦截
// 如果已经登录过了, 有token, 不需要拦截
// 如果不是去登陆, 且没有 token, 拦截到登录页
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
