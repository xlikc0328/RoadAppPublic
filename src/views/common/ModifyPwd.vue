<template>
<div>
  <Header ref="header"/>
  <ion-card>
      <ion-item>
        <ion-label>旧密码</ion-label>
        <ion-input placeholder="请输入原始密码" style="font-size:14px;" :value="oldNum" @ionChange="oldNum=$event.target.value"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label>新密码</ion-label>
        <ion-input placeholder="请输入新密码" style="font-size:14px;" :value="newNum" @ionChange="newNum=$event.target.value"></ion-input>
      </ion-item>
      <!-- <ion-item>
        <ion-label>确认密码</ion-label>
        <ion-input placeholder="请再次输入新密码" style="font-size:14px;" :value="newNum1" @ionChange="newNum1=$event.target.value"></ion-input>
      </ion-item> -->

  </ion-card>
  <ion-button expand="block" color="danger" @click="modifyPwd()">确定</ion-button>
  
</div>
</template>
<script>
import * as API from '@/api/API'
import Header from '@/components/Header'
import{ getStore, setStore, removeStore } from "@/assets/js/localStorage"
export default {
    name: 'ModifyPwd',
    components: {
    Header,
  },
    data() {
    return {
    useId:'',
    oldNum:'',
    newNum:'',
    newNum1:''
    }
  },
  mounted(){
    this.$refs.header.title = '修改密码'
  },
    methods: {
    modifyPwd(){
        const params ={
            useId:getStore("id"),
            oldNum:this.oldNum,
            newNum:this.newNum
        }
        API.modifyPwd(params).then(response =>{
            console.log(response)
            if(response.statusCode === 200){
                this.$ionic.alertController
                .create({
                header: '修改密码',
                message: '修改成功，请重新登录！',
                buttons: ['确定'],
                }).then(a => a.present())
                this.$router.push('/')
            } else {
             this.$ionic.alertController
                .create({
                header: '修改密码',
                message: '修改失败，原密码错误！',
                buttons: ['确定'],
                }).then(a => a.present())
            }
        })
    },

      back() {
        this.$router.go(-1)
      },
      home() {
        this.$router.push('/home')
      }
    }
}
</script>
<style scoped>

</style>