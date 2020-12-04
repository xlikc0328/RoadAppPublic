<template>
  <div style="margin-bottom: 60px">
    <Header ref="header" />
    <HeaderMap />
    <ion-card>
      <ion-item>
        <ion-icon name="flashlight" slot="start"></ion-icon>
        <ion-label>
          巡查路段 {{ patrolInfo.nationalHighwayName }}
          {{ patrolInfo.roadSectionName }} {{ patrolInfo.beginStake }}~{{
            patrolInfo.endStake
          }}</ion-label
        >
      </ion-item>

      <ion-item>
        <ion-icon name="business"></ion-icon>
        <ion-label> 管理单位 </ion-label>
        <ion-label> {{ patrolInfo.supervisorName }} </ion-label>
      </ion-item>

      <ion-item>
        <ion-icon name="car" slot="start"></ion-icon>
        <ion-label> 巡查车辆 </ion-label>
        <ion-label> {{ patrolInfo.patrolCar }} </ion-label>
      </ion-item>

      <ion-item>
        <ion-icon name="man"></ion-icon>
        <ion-label> 巡查员 </ion-label>
        <ion-label>{{ patrolInfo.inspector }}</ion-label>
      </ion-item>

      <ion-item>
        <ion-icon name="time" slot="start"></ion-icon>
        <ion-label> 开始时间 </ion-label>
        <ion-label> {{ patrolInfo.beginTime }} </ion-label>
      </ion-item>
    </ion-card>

    <ion-button expand="block" disabled="true" v-if="patrolEndBtn"
      >巡查中</ion-button
    >
    <ion-button expand="block" disabled="true" v-if="!patrolEndBtn"
      >本次巡查已结束</ion-button
    >

    <ion-card>
      <ion-item>
        <ion-icon
          name="add-circle-outline"
          slot="start"
          @click="addProblem"
        ></ion-icon>
        <ion-label
          v-if="problemCount === null"
          class="label-content"
          color="primary"
          @click="addProblem"
          >暂未发现问题,有待添加.</ion-label
        >
        <ion-label
          v-if="!(problemCount === null)"
          class="label-content"
          color="primary"
          @click="addProblem"
          >发现问题 ({{ problemCount }}处)</ion-label
        >
        <ion-icon name="refresh" slot="end" @click="refreshProblem"></ion-icon>
      </ion-item>

      <ion-item
        v-for="problem in problems"
        :key="problem.roadHazardId"
        @click="viewProblem(problem.roadHazardId, problem.patrolResultId)"
      >
        <ion-label class="label-content">
          {{ problem.position }} {{ problem.hazardType }}
          {{ problem.hazardUnitName }}: {{ problem.specificSize }}<br />
          <ion-label color="medium" class="time-label">{{
            problem.detectTime
          }}</ion-label>
        </ion-label>
        <ion-icon name="arrow-dropright" slot="end"></ion-icon>
      </ion-item>
    </ion-card>
    <ion-button
      expand="block"
      color="danger"
      @click="confirmEnd"
      v-if="patrolEndBtn"
      >结束巡查</ion-button
    >
    <TabBar />
  </div>
</template>

<script>
import * as API from "@/api/API";
import TabBar from "@/components/TabBar";
import Header from "@/components/Header";
import HeaderMap from "@/components/HeaderMap";
import { getStore, setStore, removeStore } from "@/assets/js/localStorage";
export default {
  name: "PatrolResult",
  components: {
    TabBar,
    Header,
    HeaderMap,
  },
  data() {
    return {
      problems: [],
      problemCount: null,
      patrolEndBtn: true,
      patrolInfo: {},
      patrolResultId: null,
    };
  },
  mounted() {
    this.$refs.header.title = "巡查结果";
    this.getPatrolInfo();
    this.getProblems();
  },

  methods: {
    refreshProblem() {
      this.getProblems();
    },

    /**
     * 获取本次巡查问题列表
     */
    getProblems() {
      const params = {
        patrolResultId: getStore("patrolResultId"),
        userId: getStore("id"),
      };
      API.getProblemsCondition(params).then((response) => {
        this.problems = response.data;
        this.problemCount = response.data.length;
      });
    },

    /**
     * 获取本次巡查信息
     */
    getPatrolInfo() {
      const params = { inspectorId: getStore("id") };
      API.getPatrolInfo(params).then((response) => {
        if (response.statusCode === 1 && response.data.length !== 0) {
          this.patrolInfo = response.data[0];
        }
      });
    },

    /**
     * 查看问题
     */
    viewProblem(roadHazardId, patrolResultId) {
      this.$router.push({
        path: "/view_problem",
        query: { roadHazardId: roadHazardId, patrolResultId: patrolResultId },
      });
    },

    /**
     * 巡查开始二次确认
     */
    confirmEnd() {
      this.$ionic.alertController
        .create({
          header: "日常巡查",
          message: "确定要结束日常巡查吗？",
          buttons: [
            {
              text: "确定",
              handler: () => {
                this.patrolEnd();
              },
            },
            { text: "取消" },
          ],
        })
        .then((a) => a.present());
    },

    /**
     * 结束巡查
     */
    patrolEnd() {
      const params = { patrolResultId: getStore("patrolResultId") };
      if (getStore("patrolResultId") !== null) {
        API.patrolEnd(params).then((response) => {
          if (response.statusCode === 1) {
            removeStore("patrolResultId");
            this.patrolEndBtn = false;
            this.getProblems();
            this.$ionic.alertController
              .create({
                header: "结束巡查",
                message: "巡查已结束",
                buttons: ["确定"],
              })
              .then((a) => a.present());
          }
        });
      } else {
        this.$ionic.alertController
          .create({
            header: "结束巡查",
            message: "您尚未开始巡查.",
            buttons: ["确定"],
          })
          .then((a) => a.present());
      }
    },

    /**
     * 添加问题
     */
    addProblem() {
      if (getStore("patrolResultId") !== null) {
        this.$router.push({
          path: "/problem",
          query: { patrolResultId: getStore("patrolResultId") },
        });
      } else {
        this.$ionic.alertController
          .create({
            header: "结束巡查",
            message: "您尚未开始巡查.",
            buttons: ["确定"],
          })
          .then((a) => a.present());
      }
    },
  },
};
</script>

<style scoped>
.time-label {
  font-size: 90%;
}
.label-content {
  font-size: 0.88rem;
}
.span-font-size {
  font-size: 0.8rem;
}
</style>
