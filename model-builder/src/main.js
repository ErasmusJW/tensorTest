import Vue from 'vue'
import App from './App.vue'
import store from './store'

import selectFolder from "./components/selectFolder.vue"
import folderContent from "./components/folderContent.vue"
import configInput from "./components/configInput.vue"
import router from './router'

Vue.component('selectFolder', selectFolder)
Vue.component('folder-content', folderContent)
Vue.component('config-input', configInput)

import VueJsonPretty from 'vue-json-pretty'

Vue.component("vue-json-pretty", VueJsonPretty)


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  router,

  created: function () {
    // `this` points to the vm instance

  }
}).$mount('#app')
