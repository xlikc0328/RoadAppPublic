<template>
  <div style="margin-bottom:60px;">
    <Header ref="header"/>
      <ion-card>
        <ion-list>
          <ion-item>
            <ion-label >巡查路线</ion-label>
            <select class="select" placeholder="请选择">
              <option v-for="(a, index) in road" :key="index">{{a.num}}</option>
            </select>
          </ion-item>
          <ion-item>
            <ion-label >巡查距离</ion-label>
            <select class="select" placeholder="请选择">
              <option v-for="(a, index) in road" :key="index">{{a.num}}</option>
            </select>
          </ion-item>
          <ion-item>
            <ion-label >巡查桩</ion-label>
            <select class="select" placeholder="请选择">
              <option v-for="(a, index) in road" :key="index">{{a.num}}</option>
            </select>
          </ion-item>
          <ion-item>         
              <ion-label>选择日期区间</ion-label>
          </ion-item>
          <ion-item>
            <ion-datetime cancel-text="取消" done-text="确认" display-format="YYYY-MM-DD HH:mm" placeholder="开始时间" min="2010" max="2030" style="margin-left:0;width:40%;font-size:1rem;"></ion-datetime>
            <ion-datetime cancel-text="取消" done-text="确认" display-format="YYYY-MM-DD HH:mm" placeholder="结束时间" min="2010" max="2030" style="margin-left:1rem;width:40%;font-size:1rem;"></ion-datetime>
            <ion-button id="btn">查看</ion-button>
            <!-- <button style="border-radius:.5rem;width:20%;height:2rem;background-color:#40AEFC;color:white;font-size:medium;">查看</button> -->
          </ion-item>
        </ion-list>
      </ion-card>

      <ion-card>
          <ion-item v-for="(a,index) in navs" :key="index" >
            <div  style="padding-left:.1rem;width:60%">
              <ion-label id="f1" >{{a.title}}</ion-label>
              <ion-label id="f2" style="float:left;" >{{a.time}}</ion-label>
              <button v-show="a.Showbutton" style="border-radius:.2rem;border-color:#40AEFC;background-color:white;color:#40AEFC;margin-left:5%;width:30%;height:1.5rem;">审批中</button>
            </div>
            <ion-chip :style="{'background':a.color}" id="btn">
              <ion-label style="padding:auto;margin:auto;font-size:.5rem;">{{a.btn}}</ion-label>
            </ion-chip>
            <ion-icon name="arrow-forward" style="margin-left:-1rem;"></ion-icon>
          </ion-item>
      </ion-card>
  </div>
</template>
<script>
import TabBar from '@/components/TabBar'
import Header from '@/components/Header'

export default {
  name: 'Record',

  components: {
      TabBar,
      Header
    },

  data() {
    return {      
      Showbutton:false,
      navs: [
        {
          title: "G202国道 0~30公里 2~25桩",
          time: "2019-11-08 5:03~7:18",
          btn: "未发现问题",
          color: "#68DB87"
        },
        {
          title: "G203国道 0~30公里 4~56桩",
          time: "2019-11-06 10:58~11:20",
          btn: "5处问题",
          color: "#EA5353"
        },
        {
          title: "G208国道 0~30公里 25~100桩",
          time: "2019-10-25 20:08~22:10",
          btn: "未发现问题",
          color: "#68DB87"
        },
        {
          title: "G209国道 0~30公里 36~120桩",
          time: "2019-9-08 13:03~14:40",
          btn: "未发现问题",
          color: "#68DB87"
        },
        {
          title: "G218国道 0~30公里 55~78桩",
          time: "2019-8-25 14:20~22:00",
          btn: "2处问题",
          color: "#EA5353"
        },
        {
          title: "G202国道 0~30公里 2~25桩",
          time: "2019-11-08 5:03~7:18",
          btn: "未发现问题",
          color: "#68DB87"
        },
        {
          title: "G203国道 0~30公里 4~56桩",
          time: "2019-11-06 10:58~11:20",
          btn: "5处问题",
          color: "#EA5353"
        }
      ],
      road: [
        {
          num: "G201国道",
          distance: [
            {
              num: "0~10公里",
              point: [{ num: "1~5桩" }, { num: "5~10桩" }]
            },
            {
              num: "10~20公里",
              point: [{ num: "0~25桩" }, { num: "25~30桩" }]
            }
          ]
        },
        {
          num: "G202国道",
          distance: [
            {
              num: "0~10公里",
              point: [{ num: "1~5桩" }, { num: "5~10桩" }]
            },
            {
              num: "10~20公里",
              point: [{ num: "0~25桩" }, { num: "25~30桩" }]
            }
          ]
        },
        {
          num: "G203国道",
          distance: [
            {
              num: "0~10公里",
              point: [{ num: "1~5桩" }, { num: "5~10桩" }]
            },
            {
              num: "10~20公里",
              point: [{ num: "0~25桩" }, { num: "25~30桩" }]
            }
          ]
        }
      ],
      vuescroll:{},
    };
  }
  
  
};
</script>
<style scoped>
.header {
  height: 3rem;
  background-color: #f2f2f2;
  text-align: center;
}
.title {
  color: #505050;
  background-color: #f2f2f2;
  font-weight: bold;
  font-size: small;
  padding-top: .5rem;
}
.title_card {
  color: #969696;
  font-size: 10px;
  margin-top: 10px;
  margin-right: auto;
  margin-left: auto;
}
img {
  padding-top: 10%;
  padding-bottom: 5%;
  padding-left: 30%;
  padding-right: 30%;
}
td {
  height: 10px;
  text-align: center;
}

.font1 {
  color: #797979;
  font-size: small;
  font-weight: bold;
}
.font2 {
  color: #bbbbbb;
  font-size: 5px;
  padding-top: 5px;
}
#f1 {
  color: #797979;
  font-size: small;
  font-weight: bold;
}
#f2 {
  color: #bbbbbb;
  font-size: 5px;
  padding-top: 5px;
}
#btn {
  width: 5rem;
  height: 2rem;
  color: #ffffff;
  margin-left: auto;
  margin-right: auto;
  border-radius: 2rem;
  font-size: 1rem;
  background-color:#40AEFC;
  font-size:medium;
}
.select {
  width: 70%;
  height: 60%;
  border-radius: 5px;
  border-block-color: #797979;
  font-size: 5px;
  color: #bbbbbb;
}
</style>