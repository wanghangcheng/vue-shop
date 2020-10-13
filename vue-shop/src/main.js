import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false;

Vue.config.devtools = true;

//引用fastclick
import FastClick from 'fastclick'
if('addEventListener' in document){
  document.addEventListener('DOMContentLoaded',function () {
    FastClick.attach(document.body);
  },false);
}
//引入全局样式
import './assets/style/common.less'
//引入全局UI组件库--vant
import './plugins/vant'
//引入rem
import './config/rem'
//引入全局过滤器
import './config/filters'
//引入二维码生成插件
import VueQriously from 'vue-qriously'
Vue.use(VueQriously)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
