<template>
  <div style="margin-bottom: 60px">
    <Header ref="header" />
    <HeaderMap />
    <ion-card>
      <ion-item>
        <ion-icon name="flashlight" slot="start"></ion-icon>
        <ion-label
          >巡查路线 {{ patrolInfo.nationalHighwayName }}
          {{ patrolInfo.roadSectionName }} {{ patrolInfo.beginStake }}~{{
            patrolInfo.endStake
          }}
        </ion-label>
      </ion-item>

      <ion-item>
        <ion-icon name="business"></ion-icon>
        <ion-label>管理单位</ion-label>
        <ion-label> {{ deptName }} </ion-label>
      </ion-item>

      <ion-item>
        <ion-icon name="car"></ion-icon>
        <ion-label>巡查车辆 </ion-label>
        <ion-label> {{ patrolInfo.patrolCar }} </ion-label>
      </ion-item>

      <ion-item>
        <ion-icon name="man"></ion-icon>
        <ion-label> 巡查员 </ion-label>
        <ion-label> {{ patrolInfo.inspector }} </ion-label>
      </ion-item>

      <ion-item>
        <ion-icon name="time" slot="start"></ion-icon>
        <ion-label> 开始时间 </ion-label>
        <ion-label> {{ patrolInfo.beginTime }} </ion-label>
      </ion-item>
      <ion-item>
        <ion-icon name="time" slot="start"></ion-icon>
        <ion-label> 结束时间 </ion-label>
        <ion-label> {{ patrolInfo.endTime }} </ion-label>
      </ion-item>
    </ion-card>

    <ion-card>
      <ion-item>
        <ion-label class="label-content" color="primary"
          >发现问题 ({{
            problemCount === null ? 0 : problemCount
          }}处)</ion-label
        >
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
  name: "ViewPatrol",
  components: {
    TabBar,
    Header,
    HeaderMap,
  },
  data() {
    return {
      problems: {},
      problemCount: null,
      patrolInfo: {},
      deptName: getStore("deptName"),
    };
  },
  mounted() {
    this.$refs.header.title = "查看巡查";
    this.getPatrolInfo();
    this.getProblemsCondition();
  },
  methods: {
    getProblemsCondition() {
      const params = {
        patrolResultId: this.$route.query.patrolResultId,
        userId: getStore("id"),
      };
      API.getProblemsCondition(params).then((response) => {
        if (response.statusCode === 1) {
          this.problems = response.data;
          this.problemCount = response.problemCount;
        } else {
          this.$ionic
            .alertController()
            .create({
              header: "暂无数据",
              message: "获取数据失败.",
              buttons: ["确定"],
            })
            .then((a) => a.present());
        }
      });
    },
    getPatrolInfo() {
      const params = { patrolResultId: this.$route.query.patrolResultId };
      API.getRoadSection(params).then((response) => {
        if (response.statusCode === 1) {
          this.patrolInfo = response.data;
        }
      });
    },
    viewProblem(roadHazardId, patrolResultId) {
      this.$router.push({
        path: "/view_patrol_problem",
        query: { roadHazardId: roadHazardId, patrolResultId: patrolResultId },
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
