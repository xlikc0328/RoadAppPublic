<template>
  <div style="margin-bottom:4rem;">
    <Header ref="header"/>
    <HeaderMap/>
    <ion-card>
      <ion-item>
        <ion-col size="3">
          <ion-label>巡查路线</ion-label>
        </ion-col>
        <ion-col>
           <p style="text-align:right">{{ roadInfo.nationalHighwayName }} {{ roadInfo.roadSectionName }}</p>
           <p style="text-align:right"> {{ roadInfo.beginStake }}~{{ roadInfo.endStake }}</p>
        </ion-col>
      </ion-item>

      <ion-item>
        <ion-label>位置</ion-label>
        <p class="xinxi">{{ assessInfo.position }}</p>
      </ion-item>

      <ion-item>
        <ion-label>病害类型</ion-label>
        <p class="xinxi">{{hazardName.name}}</p>
      </ion-item>

      <ion-item>
        <ion-label>类型尺寸</ion-label>
        <p class="xinxi" v-if="dataProblem.sizeType===1">{{sizeTypeName.hazard_unit_name}}{{":"}}{{assessInfo.specificSize}}{{"(立方米)"}}</p>
        <p class="xinxi" v-if="dataProblem.sizeType===2">{{sizeTypeName.hazard_unit_name}}{{":"}}{{assessInfo.specificSize}}{{"(平方米)"}}</p>
        <p class="xinxi" v-if="dataProblem.sizeType===3">{{sizeTypeName.hazard_unit_name}}{{":"}}{{assessInfo.specificSize}}{{"(米)"}}</p>
        <p class="xinxi" v-if="dataProblem.sizeType===4">{{sizeTypeName.hazard_unit_name}}{{":"}}{{assessInfo.specificSize}}{{"(个)"}}</p>
      </ion-item>

      <ion-item>
        <ion-label>评估时间</ion-label>
        <p class="xinxi">{{assessInfo.appraisalTime}}</p>
      </ion-item>

      <ion-item>
        <ion-label>评估造价</ion-label>
        <p class="xinxi">{{assessInfo.costPrice}}</p>
        <span>元</span>
      </ion-item>

      <ion-item>
        <ion-card-content style="width:300px;height:80px;text-align:left">
        {{assessInfo.description}}
      </ion-card-content>
      </ion-item>
    </ion-card>

    <ion-card v-if = AssessImgs.length>
      <div style="display:flex;justify-content: space-around;flex-wrap: wrap;">
      <viewer :images="AssessImgs">
        <img style="width:100px;height:100px" v-for="item in AssessImgs" :src="'http://47.99.65.198:8020/image/'+item.appraisal_img_name" :key="item.appraisal_img_name">
      </viewer>
      </div>
    </ion-card>
    <ion-card v-else style="margin-bottom:5rem;">
      <ion-label style="text-align:center;font-size:16px">
        暂无图片
      </ion-label>
    </ion-card>
    <!-- <ion-button expand="block" color="success" @click="goAddAssess()">修改</ion-button> -->
    <TabBar />
  </div>
</template>
<script>
import * as request from '@/api/API'
import Header from '@/components/Header'
import HeaderMap from '@/components/HeaderMap'
import TabBar from '@/components/TabBar_Evaluator'

export default {
  name: 'UpdateAssess',
  components: {
    Header,
    HeaderMap,
    TabBar
  },
  data() {
    return {
      assessInfo:{},
      roadInfo:{},
      AssessImgs:[],
      hazardName:{},
      sizeTypeName:{},
      dataProblem: {},
    }
  },
  mounted(){
    this.$refs.header.title = '评估结果'
    this.getAssessInfo();
    this.getcheckRoadProblem();
  },
  methods: {
    getcheckRoadProblem(){
      var params = {
        //上级传入
        roadHazardId: this.$route.query.roadHazardId
      }
      request.getcheckRoadProblem(params).then(response => {
        this.hazardName=response.hazardName
        this.sizeTypeName = response.sizeTypeName
        this.dataProblem = response.data
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
    back() {
        this.$router.go(-1)
      },
    getAssessInfo(){
      var params = {
        appraisal_id: this.$route.query.appraisalId
      }
      request.getAssessInfo(params).then(response => {
        console.log(response)
        this.assessInfo= response.data
        this.AssessImgs = response.AssessImgs
        
      })
    },
    goAddAssess(){
      //this.$router.push('/add-assess')
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
