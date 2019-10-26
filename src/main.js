import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.$axios = axios

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// // 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//   response = response.data
//   // 校验结果, 如果响应时, 发现状态码是401, 说明是无效token, 拦截到登录
//   if (response.meta.status === 401) {
//     response.meta.msg = '尊敬的用户, 您的登陆状态已过期, 请重新登陆'
//     localStorage.removeItem('token')
//     router.push('/login')
//   }
//   return response
// }, function (error) {
//   // 对响应错误做点什么
//   return Promise.reject(error)
// })

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log(response)
  response = response.data
  // 统一对响应进行处理, 如果状态码是401, 认为token过期或者无效token, 此时: 统一拦截到登陆
  if (response.meta.status === 401) {
    // this.$router => router
    response.meta.msg = '尊敬的用户, 您的登陆状态已过期, 请重新登陆'
    // 清除无效的token
    localStorage.removeItem('token')
    // 拦截到登陆
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
