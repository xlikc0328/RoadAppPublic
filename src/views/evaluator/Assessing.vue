<template>
  <div style="margin-bottom:60px;">
    <Header ref="header"/>
    <ion-card>
      <ion-card-header style="text-align:center;" >
        <ion-card-subtitle id="title_card">- 请选择评估类型 -</ion-card-subtitle>
      </ion-card-header>
      <ion-grid>
        <ion-row>
          <ion-col style="padding-bottom:10%;">
            <img src="@/assets/img/icon1.png" id="imgsize" @click="handleAssessing"> 
            <ion-title class='font1'>待评估的项目</ion-title>
            <ion-title class='font2' style="font-size:.7rem;">待评估的项目</ion-title>  
          </ion-col>
          <ion-col style="padding-bottom:10%;">
            <img src="@/assets/img/icon2.png" id="imgsize" @click="handleAssessed">
            <ion-title class='font1'>已评估的项目</ion-title>
            <ion-title class='font2' style="font-size:.7rem;">已评估的项目</ion-title>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card>
    <ion-card>
      <ion-item>
        <ion-icon name="menu"></ion-icon>
        <ion-label v-if="!evaluated">待评估的项目</ion-label>
        <ion-label v-if="evaluated">已评估的项目</ion-label>
        <ion-icon name="arrow-dropright"></ion-icon>
      </ion-item>
      <ion-grid>
        <ion-row v-if="evaluated" v-for="appraisal in appraisals" :key="appraisal.appraisalId" @click="viewResult(appraisal.applicationId, appraisal.roadHazardId, appraisal.appraisalId)">
          <ion-col>
            <ion-item>
              <ion-label class="label-content">
                {{ appraisal.nationalHighwayName }} {{ appraisal.roadSectionName }} {{ appraisal.beginStake }}~{{ appraisal.endStake }}
                <ion-label color="medium" class="time-label" style="font-size:small">{{ appraisal.position }} {{ appraisal.roadSurface }} {{ appraisal.square }} {{ appraisal.specificSize }} {{ appraisal.costPrice === "" ? 0 : appraisal.costPrice }}元</ion-label>
              </ion-label>
            </ion-item>
          </ion-col>
          <!-- <ion-col size="2">
            <ion-label>{{ appraisal.costPrice === "" ? 0 : appraisal.costPrice }}元</ion-label>
            <ion-chip color="success">
              <ion-label>查看</ion-label>
              <ion-icon name="arrow-dropright"></ion-icon>
            </ion-chip>
          </ion-col> -->
        </ion-row>

        <ion-row v-if="!evaluated" v-for="appraisal in appraisals" :key="appraisal.appraisalId" @click="viewDetail(appraisal.applicationId, appraisal.roadHazardId, appraisal.appraisalId)">
          <ion-col>
            <ion-item>
              <ion-label class="label-content">
                {{ appraisal.nationalHighwayName }} {{ appraisal.roadSectionName }} {{ appraisal.beginStake }}~{{ appraisal.endStake }}
                <ion-label color="medium" class="time-label"  style="font-size:small">{{ appraisal.position }} {{ appraisal.roadSurface }} {{ appraisal.square }} {{ appraisal.specificSize }} </ion-label>
              </ion-label>
            </ion-item>
          </ion-col>
          <!-- <ion-col size="2">
            <ion-chip color="success">
              <ion-label>查看</ion-label>
              <ion-icon name="arrow-dropright"></ion-icon>
            </ion-chip>
          </ion-col> -->
        </ion-row>
      </ion-grid>
    </ion-card>
    <TabBar/>
  </div>
</template>
<script>
import TabBar from '@/components/TabBar_Evaluator'
import Header from '@/components/Header'
import * as API from '@/api/API'
import{ getStore, setStore, removeStore } from "@/assets/js/localStorage"
export default {
  name: 'Assessing',
  components: {
    TabBar,
    Header
  },
  
  data(){
    return{
      appraisals: [],
      evaluated: 0
    }
  },

  mounted() {
    this.$refs.header.title = '公路巡查病害评估'
    this.listAssessingAppraisal()
  },

  methods: {

    /**
     * 获取待评估列表
     */
    listAssessingAppraisal() {
      const params = { thirdPartyId: getStore('id').toString() }
      API.listAssessingAppraisal(params).then(response => {
        if(response.statusCode === 1) {
          this.appraisals = response.data
        }
      })
    },

    /**
     * 获取已评估列表
     */
    listAssessedAppraisal() {
      const params = { thirdPartyId: getStore('id').toString() }
      API.listAssessedAppraisal(params).then(response => {
        if(response.statusCode === 1) {
          this.appraisals = response.data
          this.evaluated = response.evaluated
        }
      })
    },

    handleAssessing() {
      this.listAssessingAppraisal()
      this.evaluated = 0
    },

    handleAssessed() {
      this.listAssessedAppraisal()
      this.evaluated = 1
    },

    viewResult(applicationId, roadHazardId, appraisalId) {
      this.$router.push({ path: '/update-assess', query: { 'applicationId': applicationId, 'roadHazardId': roadHazardId, 'appraisalId': appraisalId } })
    },

    viewDetail(applicationId, roadHazardId, appraisalId) {
      this.$router.push({ path: '/view-assess', query: { 'applicationId': applicationId, 'roadHazardId': roadHazardId, 'appraisalId': appraisalId } })
    }
  }    
}
</script>
<style>
  #title_card{
    color: #969696; 
    font-size: 10px;
    margin-top: 1rem;
  }
  .font1{     
    color:#797979;
    font-size: small;
    font-weight: bold;
    text-align: center
  }
  .font2{     
    color:#BBBBBB;
    padding-top: 5px;
    text-align: center
  }
  #imgsize{
    width: auto;
    height: auto;
    padding-top: 10%;
    margin: auto;
  }
</style>