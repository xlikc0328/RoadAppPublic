<template>
  <div style="margin-bottom:3rem;">
    <Header ref="header"/>
    <HeaderMap ref="map"/>
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
        <ion-label>位置</ion-label>
        <p class="xinxi">{{ dataProblem.position }}</p>
      </ion-item>

      <ion-item>
        <ion-label>病害情况</ion-label>
        <ion-select :value="addAssessInfoForm.hazardStatus" @ionChange="addAssessInfoForm.hazardStatus=$event.target.value" placeholder="选择" ok-Text="确定" cancel-text="取消">
         <ion-select-option v-for="(option, index) in hazardList" :key="index" :value = option.info_id>{{ option.name }}</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-segment>
        <ion-segment-button value="cube" checked="true" @click="handleCube">
          <ion-label>体积</ion-label>
        </ion-segment-button>
        <ion-segment-button value="square" @click="handleSquare" >
          <ion-label>面积</ion-label>
        </ion-segment-button>
        <ion-segment-button value="length" @click="handleLength">
          <ion-label>长度</ion-label>
        </ion-segment-button>
        <ion-segment-button value="count" @click="handleCount">
          <ion-label>个数</ion-label>
        </ion-segment-button>
      </ion-segment>

      <ion-grid v-if="cubeOrSquare">
        <ion-row>
          <ion-col>
            <ion-input type="number" placeholder="请输入长度" :value="cubeOrSquareLength" @ionInput="cubeOrSquareLength=$event.target.value"></ion-input>
          </ion-col>
          <ion-col>
            <ion-input type="number" placeholder="请输入宽度" :value="cubeOrSquareWidth" @ionInput="cubeOrSquareWidth=$event.target.value"></ion-input>
          </ion-col>
          <ion-col v-if="!square">
            <ion-input type="number" placeholder="请输入高度" :value="cubeOrSquareHeight" @ionInput="cubeOrSquareHeight=$event.target.value"></ion-input>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-grid v-if="lengthOrNumber">
        <ion-row>
          <ion-col v-if="length">
            <ion-input type="number" placeholder="请输入长度" :value="lengthOrNumberLength" @ionInput="lengthOrNumberLength=$event.target.value"></ion-input>
          </ion-col>
          <ion-col v-if="!length">
            <ion-input type="number" placeholder="请输入个数" :value="lengthOrNumberNumber" @ionInput="lengthOrNumberNumber=$event.target.value"></ion-input>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-item>
        <ion-label>评估造价</ion-label>
        <ion-input type="number" :value="addAssessInfoForm.costPrice" @ionChange="addAssessInfoForm.costPrice=$event.target.value" placeholder="输入评估造价金额"></ion-input>
        <span>元</span>
      </ion-item>

      <ion-item>
        <ion-label position="floating">请输入评估备注</ion-label>
        <ion-textarea  :value="addAssessInfoForm.description"  @ionChange="addAssessInfoForm.description=$event.target.value"></ion-textarea>
      </ion-item>

    </ion-card>

    <ion-card>
      <input
        @change="fileChange($event)"
        type="file"
        id="upload_file"
        multiple
        style="display: none"
      />

      <div class="add-img">
        <p class="font14" v-show="imgList.length">
          图片(最多6张，还可上传
          <span v-text="6-imgList.length"></span>张)
        </p>
          <div style="display:flex;justify-content: space-around;flex-wrap: wrap;">
              <div v-for="(url,index) in imgList" :key="index" v-show="imgList.length">
                <!-- <ion-icon name="close-circle" @click.stop="delImg(index)"></ion-icon> -->
                <img style="width:10px;height:10px;" align="right" src="@/assets/img/delect.png"  @click.stop="delImg(index)"> 
                <img style="width:90px;height:100px" :src="url.file.src" />
              </div>

              <div class="add" @click="chooseType" v-show="imgList.length!=6">
                  <div class="add-image" align="center">
                    <ion-icon style="font-size: 2rem" name="add"></ion-icon>
                    <p>添加图片</p>
                  </div>
              </div>
          </div>
      </div>
    </ion-card>
    <TabBar />
    <ion-button expand="block" color="primary" @click="addAssessInfo()">保存</ion-button>
  </div>
</template>
<script>
import Header from '@/components/Header'
import HeaderMap from '@/components/HeaderMap'
import TabBar from '@/components/TabBar_Evaluator'
import * as API from '@/api/API'
import axios from 'axios'
import{getStore,setStore,removeStore} from "@/assets/js/localStorage";

export default {
  name: 'AddAssess',
  components: {
    Header,
    HeaderMap,
    TabBar
  },
  data() {
    return {
      imgList: [],
      size: 0,
      limit: 6, //限制图片上传的数量
      hazardList:[],
      hazardImgs:[],
      dataProblem: {},
      hazardName: {},
      roadInfo:{},
      cubeOrSquare: true,
      square: false,
      lengthOrNumber: false,
      length: false,
      cubeOrSquareLength: null,
      cubeOrSquareWidth: null,
      cubeOrSquareHeight: null,

      lengthOrNumberLength: null,
      lengthOrNumberNumber: null,
      addAssessInfoForm:{
        //位置（桩+侧+米）
        position:"",
        //病害情况
        hazardStatus:"",
        //类型尺寸
        sizeType:"",
        //具体尺寸
        specificSize:"",
        //评估造价
        costPrice:"",
        //评估备注
        description:"",
        //经度
        longitude:"",
        //纬度
        latitude:"",
        //巡检情况
        patrolResultId:"",
        //申请表
        applicationId:'',
        //登录账号
        appraisalOrganisationId:'',
      }
    }
  },
  mounted(){
    this.$refs.header.title = '添加评估'
    this.getcheckRoadProblem();
    this.getAllhazard();
  },
  methods: {
    getAllhazard(){
      API.getAllhazard().then(response =>{
           this.hazardList = response.data;
      })
    },
    back() {
        this.$router.go(-1)
      },
      clearAll() {
      this.cubeOrSquareLength = null
      this.cubeOrSquareWidth = null
      this.cubeOrSquareHeight = null
      this.lengthOrNumberLength = null
      this.lengthOrNumberNumber = null
    },
    handleCube() {
      this.cubeOrSquare = true
      this.lengthOrNumber = false
      this.square = false
      this.clearAll()
    },
    handleSquare() {
      this.cubeOrSquare = true
      this.lengthOrNumber = false
      this.square = true
      this.clearAll()
    },
    handleLength() {
      this.cubeOrSquare = false
      this.lengthOrNumber = true
      this.length = true
      this.clearAll()
    },
    handleCount() {
      this.cubeOrSquare = false
      this.lengthOrNumber = true
      this.length = false
      this.clearAll()
    },
    getcheckRoadProblem(){
      var params = {

        //上级传入
        roadHazardId: this.$route.query.roadHazardId,
      }
      API.getcheckRoadProblem(params).then(response => {
        this.hazardName = response.hazardName 
        this.dataProblem = response.data
        this.hazardImgs = response.hazardImgs
        this.getRoadSection(response.data.patrolResultId)
      })
    },
    getRoadSection(patrolResultId) {
      const params = {
        patrolResultId: patrolResultId
      }
      API.getRoadSection(params).then(response => {
        if(response.statusCode === 1) {
          this.roadInfo = response.data
        }
      })
    },
    addAssessInfo(){
      if(this.cubeOrSquareLength !=null && this.cubeOrSquareWidth !=null && this.cubeOrSquareHeight!=null){
        this.addAssessInfoForm.sizeType = 1
        this.addAssessInfoForm.specificSize = this.cubeOrSquareLength + "," + this.cubeOrSquareWidth + "," + this.cubeOrSquareHeight;
      }
      else if(this.cubeOrSquareLength !=null && this.cubeOrSquareWidth !=null){
        this.addAssessInfoForm.sizeType = 2
        this.addAssessInfoForm.specificSize = this.cubeOrSquareLength + "," + this.cubeOrSquareWidth;
      }
      else if(this.lengthOrNumberLength !=null ){
         this.addAssessInfoForm.sizeType = 3
         this.addAssessInfoForm.specificSize = this.lengthOrNumberLength;
      }
      else{
         this.addAssessInfoForm.sizeType = 4
         this.addAssessInfoForm.specificSize = this.lengthOrNumberNumber;
      }

      this.addAssessInfoForm.position = this.dataProblem.position;
      this.addAssessInfoForm.hazardStatus = this.dataProblem.hazardStatus;
      this.addAssessInfoForm.latitude = this.$refs.map.lat;
      this.addAssessInfoForm.longitude = this.$refs.map.lng;
      this.addAssessInfoForm.patrolResultId = this.dataProblem.patrolResultId;
      //上级传入
      this.addAssessInfoForm.applicationId = this.$route.query.applicationId
      //登陆账号-全局引入
      this.addAssessInfoForm.appraisalOrganisationId = getStore('id').toString()
      var params = this.addAssessInfoForm;
      //测试添加评估（无图片）
      // API.addAssessInfo(params).then(response =>{
      //   this.$router.push('/assessing')
      // })

      //传图片用的变量
      var appraisalId =0;
      API.addAssessInfo(params).then(response =>{
        appraisalId = response
        for(let i=0;i<this.imgList.length;i++){
        let param = new FormData();
        param.append("file", this.imgList[i].file);
        param.append("appraisalId",appraisalId)
        let config = {headers: { "Content-Type": "multipart/form-data" },};
        axios.post('http://47.99.65.198:8020/road_hazard_img/uploadAppraisal', param ,config).then(
        function (response) 
        {  })
        .catch(function (error) {
        });
      }

        this.$router.push('/assessing')

      })
    },


    chooseType() {
      document.getElementById("upload_file").click();
    },
    fileChange(el) {
      if (!el.target.files[0].size) return;
      this.fileList(el.target);
      el.target.value = "";
    },
    fileList(fileList) {
      let files = fileList.files;
      for (let i = 0; i < files.length; i++) {
        //判断是否为文件夹
        if (files[i].type != "") {
          this.fileAdd(files[i]);
        } else {
          //文件夹处理
          this.folders(fileList.items[i]);
        }
      }
    },
    //文件夹处理
    folders(files) {
      let _this = this;
      //判断是否为原生file
      if (files.kind) {
        files = files.webkitGetAsEntry();
      }
      files.createReader().readEntries(function(file) {
        for (let i = 0; i < file.length; i++) {
          if (file[i].isFile) {
            _this.foldersAdd(file[i]);
          } else {
            _this.folders(file[i]);
          }
        }
      });
    },
    foldersAdd(entry) {
      let _this = this;
      entry.file(function(file) {
        _this.fileAdd(file);
      });
    },
    fileAdd(file) {
      if (this.limit !== undefined) this.limit--;
      if (this.limit !== undefined && this.limit < 0) return;
      //总大小
      this.size = this.size + file.size;
      //判断是否为图片文件
      if (file.type.indexOf("image") == -1) {
        this.$dialog.toast({ mes: "请选择图片文件" });
      } else {
        let reader = new FileReader();
        let image = new Image();
        let _this = this;
        reader.readAsDataURL(file);
        reader.onload = function() {
          file.src = this.result;
          image.onload = function() {
            let width = image.width;
            let height = image.height;
            file.width = width;
            file.height = height;
            _this.imgList.push({
              file
            });
          };
          image.src = file.src;
        };
      }
    },
    delImg(index) {
      this.size = this.size - this.imgList[index].file.size; //总大小
      this.imgList.splice(index, 1);
      if (this.limit !== undefined) this.limit = 6 - this.imgList.length;
    },
    
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
