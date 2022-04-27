import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Notifications from 'vue-notification'
import VueTippy, { TippyComponent } from "vue-tippy";

Vue.config.productionTip = false
Vue.use(Notifications)
Vue.use(VueTippy);

Vue.component("tippy-component", TippyComponent);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
