<template>
<div class="tab-bottm">
  <ion-tabs >
    <ion-tab tab="home">
      
    </ion-tab>

    <!-- Match by "app.patrol" route name -->
    <ion-tab tab="inspection" :routes="'app.inspection'">
    </ion-tab>

    <!-- Match by an array of route names -->
    <ion-tab tab="settings" :routes="['app.settings', 'app.other.route']">
      <Settings />
    </ion-tab>

    <!-- Use v-slot:bottom with Vue ^2.6.0 -->
    <template v-slot:bottom>
      <ion-tab-bar>
        <ion-tab-button tab="home">
          <ion-icon name="home"></ion-icon>
          <ion-label>首页</ion-label>
        </ion-tab-button>

        <!-- Provide a custom route to navigate to -->
        <ion-tab-button tab="inspection">
          <ion-icon name="man"></ion-icon>
          <ion-label>巡检</ion-label>
        </ion-tab-button>

        <!-- Provide extra data to route -->
        <ion-tab-button tab="settings">
          <ion-icon name="settings"></ion-icon>
          <ion-label>设置</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </template>
  </ion-tabs>
</div>
  <!-- Listen to before and after tab change events -->
  
</template>

<script>
export default {
    name: 'TabBar'
}
</script>
<style scoped>
  .tab-bottm {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
  }
</style>