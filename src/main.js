import Vue from 'vue'
import App from './App.vue'
import router from './router'
import IonicVue from '@ionic/vue'
import '@ionic/core/css/core.css'
import VueAMap from 'vue-amap'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.use(VueAMap)
Vue.use(IonicVue)
Vue.config.productionTip = false
Vue.use(Viewer);

Viewer.setDefaults({
  Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});

VueAMap.initAMapApiLoader({
  key: 'd76bc47b1514ccae248ba4b261024926',
  plugin: ['Autocomplete', 'Geolocation', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'AMap.CircleEditor']
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
