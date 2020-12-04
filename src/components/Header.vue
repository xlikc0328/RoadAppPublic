<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="primary" @click="back">
          <ion-icon name="arrow-back"></ion-icon>
          返回
        </ion-button>
      </ion-buttons>
      <ion-title style="text-align: center">{{ title }}</ion-title>
      <ion-buttons slot="end">
        <ion-button color="primary" @click="home">
          <ion-icon name="home"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>
<script>
export default {
  name: "Header",
  data() {
    return {
      title: "",
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    home() {
      this.$router.push("/home");
    },
  },
};
</script>
<style scoped>
</style>