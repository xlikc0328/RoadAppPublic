<template>
  <div style="margin-bottom:60px">
    <Header ref="header"/>
    <HeaderMap/>
    <ion-card>
      <ion-item>
        <ion-icon name="locate" slot="start"></ion-icon>
        <ion-label>选择路线</ion-label>
        <ion-select placeholder="请选择" :value="nationalHighwayId" @ionChange="nationalHighwayId=$event.target.value" ok-text="确定" cancel-text="取消">
          <ion-select-option v-for="(highway, index) in nationalHighways" :key="index" :value=highway.highwayId>{{ highway.highwayName }}</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-icon name="locate" slot="start"></ion-icon>
        <ion-label>选择路线</ion-label>
        <ion-select placeholder="请选择" :value="patrolResult.roadSectionId" @ionChange="patrolResult.roadSectionId=$event.target.value" ok-text="确定" cancel-text="取消">
          <ion-select-option v-for="(roadSection, index) in roadSections" :key="index" :value=roadSection.roadSectionId>{{ roadSection.name }}</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-icon name="skip-backward"></ion-icon>
        <ion-label>选择起始桩</ion-label>
        <ion-select placeholder="请选择" :value="patrolResult.stakeBeginId" @ionChange="patrolResult.stakeBeginId=$event.target.value" ok-text="确定" cancel-text="取消">
          <ion-select-option v-for="(stake, index) in stakes" :key="index" :value=stake.stakeId>{{ stake.name }}</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-icon name="skip-forward"></ion-icon>
        <ion-label>选择结束桩</ion-label>
        <ion-select placeholder="请选择" :value="patrolResult.stakeEndId" @ionChange="patrolResult.stakeEndId=$event.target.value" ok-text="确定" cancel-text="取消">
          <ion-select-option v-for="(stake, index) in stakes" :key="index" :value=stake.stakeId>{{ stake.name }}</ion-select-option>
        </ion-select>
      </ion-item>

      <!-- <ion-item>
        <ion-icon name="skip-forward"></ion-icon>
        <ion-label>选择结束桩</ion-label>
        <ion-input type="number" placeholder="请输入起始桩"></ion-input>
        <ion-label>号桩</ion-label>
      </ion-item> -->

      <ion-item>
        <ion-icon name="business" slot="start"></ion-icon>
        <ion-label>管理单位</ion-label>
        <ion-label>{{ deptName }}</ion-label>
      </ion-item>

      <ion-item>
        <ion-icon name="car" slot="start"></ion-icon>
        <ion-label>巡查车辆</ion-label>
        <ion-select placeholder="选择车辆" :value="patrolResult.patrolCar" @ionChange="patrolResult.patrolCar=$event.target.value" ok-text="确定" cancel-text="取消">
          <ion-select-option v-for="(patrolCar, index) in patrolCars" :key="index" :value="patrolCar.carNumber">{{ patrolCar.carNumber }}</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-icon name="man" slot="start"></ion-icon>
        <ion-label> 巡查员 </ion-label>
        <ion-label>{{ inspectorName }}</ion-label>
      </ion-item>
    </ion-card>
    <ion-button expand="block" @click="patrolBegin">开始巡查</ion-button>

    <ion-card>
      <ion-item v-if="patrolEndBtn">
        <ion-icon name="add-circle-outline" slot="start" @click="addProblem"></ion-icon>
        <ion-label v-if="problemCount === null" class="label-content" color="primary">暂未发现问题,有待添加.</ion-label>
        <ion-label v-if="!problemCount === null" class="label-content" color="primary">发现问题 ({{ problemCount }}处)</ion-label>
      </ion-item>

      <ion-item v-for="problem in problems" :key="problem.roadHazardId" @click="viewDetail(problem.roadHazardId, problem.patrolResultId)">
        <ion-label class="label-content">
          {{ problem.position }} {{ problem.hazardType }} {{ problem.hazardUnitName }}: {{ problem.specificSize }}<br>
          <ion-label color="medium" class="time-label">{{ problem.detectTime }}</ion-label>
        </ion-label>
        <ion-icon name="arrow-dropright" slot="end"></ion-icon>
      </ion-item>
    </ion-card>
    <ion-button expand="block" color="danger" @click="patrolEnd" v-if="patrolEndBtn">结束巡查</ion-button>
    <TabBar/>
  </div>
</template>

<script>
import * as API from '@/api/API'
import TabBar from '@/components/TabBar'
import Header from '@/components/Header'
import HeaderMap from '@/components/HeaderMap'
import{ getStore, setStore, removeStore } from "@/assets/js/localStorage"
export default {
  name: 'TempPatrol',
  components: {
    TabBar,
    Header,
    HeaderMap
  },
  data() {
    return {
      problems: {},
      problemCount: null,
      patrolInfo: {},
      nationalHighways: [],
      roadSections: [],
      stakes: [],
      patrolCars: [],
      nationalHighwayId: null,
      patrolEndBtn: false,
      patrolResult: {
        nationalHighwayId: null,
        roadSectionId: null,
        patrolCar: null,
        stakeEndId: null,
        stakeBeginId: null,
        // 需要改动成当前登录用户所属部门的ID
        patrolOrganizationId: getStore('deptId'),
        // 需要改动成当前登录用户的ID
        inspectorId: getStore('id')
      },
      patrolResultId: null,
      deptName: getStore('deptName'),
      inspectorName: getStore('name')
    }
  },
  watch: {
    /**
     * 当选中路线后执行
     */
    nationalHighwayId() {
      const params = { nationalHighwayId: this.nationalHighwayId }
      API.listRoadSection(params).then(response => {
        this.roadSections = response.data
      })
    }
  },
  mounted() {
    this.$refs.header.title = '临时巡检'
    this.listNationalHighway()
    this.listPatrolCar()
    this.listStake()
  },
  methods: {

    /**
     * 获取路线列表
     */
    listNationalHighway() {
      API.listNationalHighway().then(response => {
        this.nationalHighways = response.data
      })
    },

    /**
     * 获取桩列表
     */
    listStake() {
      API.listStake().then(response => {
        this.stakes = response.data
      })
    },
    
    /**
     * 获取巡逻车辆
     */
    listPatrolCar() {
      const params = { deptId: getStore('deptId') }
      API.listPatrolCar(params).then(response => {
        if (response.statusCode === 1) {
          this.patrolCars = response.data
        }
      })
    },

    /**
     * 开始巡查
     */
    patrolBegin() {
      this.patrolResult.nationalHighwayId = this.nationalHighwayId
      const params = this.patrolResult
      if (!(this.patrolResult.roadSectionId === null || this.patrolResult.stakeEndId === null || this.patrolResult.stakeBeginId === null || this.patrolResult.patrolCar === null)) {
        API.patrolBegin(params).then(response => {
          if (response.statusCode === 1) {
            this.patrolResultId = response.data.patrolResultId
            setStore('patrolResultId', response.data.patrolResultId)
            this.patrolEndBtn = true
            this.$ionic.alertController.create({
              header: '开始巡查',
              message: "开始巡查",
              buttons: ['确定']
            }).then(a => a.present())
          }
        })
      } else {
        this.$ionic.alertController
          .create({
            header: '开始巡查',
            message: "请先补全巡查信息",
            buttons: ['确定']
          }).then(a => a.present())
      }
    },

    /**
     * 结束巡查
     */
    patrolEnd() {
      const params = { patrolResultId: getStore('patrolResultId') }
      if(getStore('patrolResultId') !== null) {
        API.patrolEnd(params).then(response => {
          if (response.statusCode === 1) {
            removeStore('patrolResultId')
            this.patrolEndBtn = false
            this.$ionic.alertController.create({
              header: '结束巡查',
              message: '巡查已结束',
              buttons: ['确定']
            }).then(a => a.present());
            this.$router.push({ path: '/inspection' })
          }
        })
      } else {
        this.$ionic.alertController
          .create({
            header: '结束巡查',
            message: "您尚未开始巡查.",
            buttons: ['确定']
          }).then(a => a.present())
      }
    },
    /**
     * 查看问题详情
     */
    viewDetail(roadHazardId, patrolResultId) {
      this.$router.push({ path: '/view_problem', query: { "roadHazardId": roadHazardId, "patrolResultId": patrolResultId} })
    },

    /**
     * 前往添加问题页面
     */
    addProblem() {
      if(getStore('patrolResultId') !== null) {
        this.$router.push({ path: '/problem', query: { "patrolResultId": getStore('patrolResultId') }})
      } else {
        this.$ionic.alertController.create({
          header: '添加问题',
          message: '巡查未开始或已结束, 不可添加问题',
          buttons: ['确定']
        }).then(a => a.present())
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .time-label {
    font-size: 90%
  }
  .span-font-size {
    font-size:.80rem
  }
</style>
