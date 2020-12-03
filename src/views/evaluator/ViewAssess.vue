<template>
  <div style="margin-bottom:3rem;">
    <Header ref="header"/>
    <HeaderMap/>
    <ion-card>
      <ion-item>
        <ion-col size="3">
          <ion-label>巡检路线</ion-label>
        </ion-col>
        <ion-col>
           <p style="text-align:right">{{ roadInfo.nationalHighwayName }} {{ roadInfo.roadSectionName }}</p>
           <p style="text-align:right"> {{ roadInfo.beginStake }}~{{ roadInfo.endStake }}</p>
        </ion-col>
      </ion-item>

      <ion-item>
        <!-- <ion-icon name="weizhi" slot="start"></ion-icon> -->
        <ion-label>位置</ion-label>
        <p class="xinxi">{{ dataProblem.position }}</p>
      </ion-item>

      <ion-item>
        <!-- <ion-icon name="qingkuang" slot="start"></ion-icon> -->
        <ion-label>病害情况</ion-label>
        <p class="xinxi">{{hazardName.name}}</p>
      </ion-item>

      <ion-item>
        <!-- <ion-icon name="leixing" slot="start"></ion-icon> -->
        <ion-label>类型尺寸</ion-label>
        <p class="xinxi" v-if="dataProblem.sizeType===1">{{sizeTypeName.hazard_unit_name}}{{":"}}{{dataProblem.specificSize}}{{"(立方米)"}}</p>
        <p class="xinxi" v-if="dataProblem.sizeType===2">{{sizeTypeName.hazard_unit_name}}{{":"}}{{dataProblem.specificSize}}{{"(平方米)"}}</p>
        <p class="xinxi" v-if="dataProblem.sizeType===3">{{sizeTypeName.hazard_unit_name}}{{":"}}{{dataProblem.specificSize}}{{"(米)"}}</p>
        <p class="xinxi" v-if="dataProblem.sizeType===4">{{sizeTypeName.hazard_unit_name}}{{":"}}{{dataProblem.specificSize}}{{"(个)"}}</p>
      </ion-item>

      <ion-item>
        <!-- <ion-icon name="shijian" slot="start"></ion-icon> -->
        <ion-label>发现时间</ion-label>
        <p class="xinxi">{{dataProblem.detectTime}}</p>
      </ion-item>
    </ion-card>

    <!-- <h4 style="color:red;text-align:left;margin:10px" v-if="dataProblem.potentialHazard == '有'">存在安全隐患</h4>
    <h4 style="color:green;text-align:left;margin:10px" v-else>无安全隐患</h4> -->
    <ion-card>
      <ion-card-content style="width:300px;height:80px;text-align:left">
        {{dataProblem.description}}
      </ion-card-content>
    </ion-card>
    <ion-card v-if = hazardImgs.length>
      <div style="display:flex;justify-content: space-around;flex-wrap: wrap;">
      <viewer :images="hazardImgs">
        <img style="width:100px;height:100px" v-for="item in hazardImgs" :src="'http://47.99.65.198:8020/image/'+item.name" :key="item.name">
      </viewer>
      </div>
    </ion-card>
    <ion-card v-else style="margin-bottom:5rem;">
      <ion-label style="text-align:center;font-size:16px">
        暂无图片
      </ion-label>
    </ion-card>

    <TabBar />
    <ion-button expand="block" color="success" @click="addRoadProblem()">评估</ion-button>
  </div>
</template>
<script>
import * as request from '@/api/API'
import Header from '@/components/Header'
import HeaderMap from '@/components/HeaderMap'
import TabBar from '@/components/TabBar_Evaluator'

export default {
  name: 'ViewAssess',
  components: {
    Header,
    HeaderMap,
    TabBar
  },
  data() {
    return {
      hazardImgs:[],
      dataProblem: {},
      hazardName: {},
      sizeTypeName:{},
      roadInfo:{},
    }
  },
  mounted(){
    this.$refs.header.title = '查看问题'
    this.getcheckRoadProblem();
  },
  methods: {
    back() {
        this.$router.go(-1)
      },
    getcheckRoadProblem(){
      var params = {
        //上级传入
        roadHazardId: this.$route.query.roadHazardId
      }
      request.getcheckRoadProblem(params).then(response => {
        this.hazardName = response.hazardName 
        this.dataProblem = response.data
        this.hazardImgs = response.hazardImgs
        this.sizeTypeName = response.sizeTypeName
        this.getRoadSection(response.data.patrolResultId)
      })
    },
    getRoadSection(patrolResultId) {
      const params = {
        patrolResultId: patrolResultId
      }
      request.getRoadSection(params).then(response => {
        if(response.statusCode === 1) {
          this.roadInfo = response.data
        }
      })
    },
    addRoadProblem(){
      //需要传参（roadHazardId,applicationId）
      this.$router.push({path:'/add-assess', query:{'roadHazardId':this.$route.query.roadHazardId,'applicationId':this.$route.query.applicationId}})
    }
    
  }
}

</script>
<style>
.xinxi{
    position:relative;
    left:-15px;
    font-size:0.6rem;
    text-align:left
}
img{
  width: 100px;
  height: 100px;
  float: center;
  padding: 5px;

}
.time-label {
    font-size: 90%
  }
  .label-content {
    font-size: .88rem
  }
  .amap-demo {
    height: 100px;
  }
</style>
