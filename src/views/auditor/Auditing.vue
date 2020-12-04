<template>
  <div style="margin-bottom:60px;">
    <Header ref="header"/>
    <ion-card>
      <ion-card-header style="text-align:center;" >
        <ion-card-subtitle id="title_card">- 请选择核量类型 -</ion-card-subtitle>
      </ion-card-header>
      <ion-grid>
        <ion-row>
          <ion-col style="padding-bottom:10%;">
            <img src="@/assets/img/icon1.png" id="imgsize" @click="handleAuditing"> 
            <ion-title class='font1'>待核量的项目</ion-title>
            <ion-title class='font2' style="font-size:.7rem;">待核量的项目</ion-title>  
          </ion-col>
          <ion-col style="padding-bottom:10%;">
            <img src="@/assets/img/icon2.png" id="imgsize" @click="handleAudited">
            <ion-title class='font1'>已核量的项目</ion-title>
            <ion-title class='font2' style="font-size:.7rem;">已核量的项目</ion-title>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card>
    <ion-card>
      <ion-item>
        <ion-icon name="menu"></ion-icon>
        <ion-label v-if="audited">已核量的项目</ion-label>
        <ion-label v-if="!audited">待核量的项目</ion-label>
        <ion-icon name="arrow-dropright"></ion-icon>
      </ion-item>
      <ion-grid>
        <ion-row v-if="audited" v-for="acceptance in acceptances" :key="acceptance.appraisalId" @click="auditResult(acceptance.applicationId, acceptance.roadHazardId, acceptance.acceptanceId)">
          <ion-col>
            <ion-item>
              <ion-label class="label-content">
                {{ acceptance.nationalHighwayName }} {{ acceptance.roadSectionName }} {{ acceptance.beginStake }}~{{ acceptance.endStake }}
                <ion-label color="medium" class="time-label" style="font-size:small;">{{ acceptance.position }} {{ acceptance.name }} {{ acceptance.costPrice === "" ? 0 : acceptance.costPrice }}元</ion-label>
              </ion-label>
            </ion-item>
          </ion-col>
          <!-- <ion-col size="2">
            <ion-label>
              <ion-chip v-if="acceptance.firstAuditResult===1" color = "success">已完成</ion-chip>
              <ion-chip v-if="acceptance.firstAuditResult===0" color = "danger">未完成</ion-chip>
            </br>
              <ion-label>{{ acceptance.costPrice === "" ? 0 : acceptance.costPrice }}元</ion-label>
            </ion-label>
          </ion-col> -->
          <!-- <ion-col size="2">
            <ion-chip color="success">
              <ion-label>查看</ion-label>
              <ion-icon name="arrow-dropright"></ion-icon>
            </ion-chip>
          </ion-col> -->
        </ion-row>

        <ion-row v-if="!audited" v-for="acceptance in acceptances" :key="acceptance.appraisalId" @click="auditing(acceptance.applicationId, acceptance.roadHazardId, acceptance.acceptanceId)">
          <ion-col size="10">
            <ion-item>
              <ion-label class="label-content">
                {{ acceptance.nationalHighwayName }} {{ acceptance.roadSectionName }} {{ acceptance.beginStake }}~{{ acceptance.endStake }}
                <ion-label color="medium" class="time-label">{{ acceptance.position }} {{ acceptance.roadSurface }} {{ acceptance.square }} {{ acceptance.specificSize }} </ion-label>
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
import TabBar from '@/components/TabBar_Auditor'
import Header from '@/components/Header'
import * as API from '@/api/API'
import{ getStore, setStore, removeStore } from "@/assets/js/localStorage"
export default {
  name: 'Auditing',
  components: {
    TabBar,
    Header
  },
  
  data() {
    return{
      acceptances: [],
      audited: 0
    }
  },

  mounted() {
    this.listAcceptanceIng()
    this.$refs.header.title = '公路巡查核量'
  },

  methods: {

    /**
     * 从已核量项目中跳转到核量结果页面
     */
    auditResult(applicationId, roadHazardId, acceptanceId) {
      this.$router.push({
        path: '/audit-result',
        query: {
          'applicationId': applicationId,
          'roadHazardId': roadHazardId,
          'acceptanceId': acceptanceId
        }
      })
    },

    /**
     * 从未核量项目中跳转到核量页面
     */
    auditing(applicationId, roadHazardId, acceptanceId) {
      this.$router.push({
        path: '/audit',
        query: {
          'applicationId': applicationId,
          'roadHazardId': roadHazardId,
          'acceptanceId': acceptanceId
        }
      })
    },

    handleAuditing() {
      this.listAcceptanceIng()
      this.audited = 0
    },

    handleAudited () {
      this.listAcceptanceEd()
      this.audited = 1
    },

    
    /**
     * 获取待核量列表
     */
    listAcceptanceIng() {
      const params = { thirdPartyId: getStore('id').toString() }
      API.listAcceptanceIng(params).then(response => {
        if(response.statusCode === 1) {
          this.acceptances = response.data
        }
      })
    },

    /**
     * 获取已核量列表
     */
    listAcceptanceEd() {
      const params = { thirdPartyId: getStore('id').toString() }
      API.listAcceptanceEd(params).then(response => {
        if(response.statusCode === 1) {
          this.acceptances = response.data
          this.audited = response.audited
        }
      })
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
    text-align: center;
  }
  #imgsize{
    width: auto;
    height: auto;
    padding-top: 10%;
    margin: auto;
  }
</style>