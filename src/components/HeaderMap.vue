<template>
	<ion-card>
    <div class="amap-page-container">
      <el-amap :plugin="plugin" :zoom="zoom" class="amap-demo"></el-amap>
      <div class="toolbar">
        <span v-if="loaded">
          经度 = {{ lng }} 纬度 = {{ lat }}
        </span>
        <span v-else>正在定位</span>
      </div>
    </div>
  </ion-card>
</template>

<script>
export default {
  name: 'HeaderMap',
  data() {
  	let self = this
	  return {
	    zoom: 16,
	    center: [],
	    lng: 0,
	    lat: 0,
	    loaded: false,
	    plugin: [
	      {
	        pName: 'Geolocation',
	        events: {
	          init(o) {
	            // o 是高德地图定位插件实例
	            o.getCurrentPosition((status, result) => {
	              if (result && result.position) {
	                self.lng = result.position.lng
	                self.lat = result.position.lat
	                self.center = [self.lng, self.lat]
	                self.loaded = true
	                self.$nextTick()
	              }
	            })
	          }
	        }
	      }
	    ]
	  }
  }
}
</script>
<style scoped="">
	.amap-demo {
    height: 10rem;
  }
</style>