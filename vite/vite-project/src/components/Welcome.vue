<template>
    <div class="welcome">
        <div class="content">
            <div class="sub-title">欢迎光临</div>
            <div class="title">马士兵后台管理系统</div>
            <div class="description">Vue3+koa2+mongodb+node 打造通用EPR管理系统</div>
        </div>
        <div class="img"></div>
    </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import storage from "../utils/storage";

onMounted(()=>{

    storage.setItem("user",{id:1,desc:"...",age:31});
    console.log(storage.getItem("user"))
});
</script>

<style scoped>
  .welcome{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #f5faff;
  }

  .welcome .sub-title{
    font-size: 30px;
    line-height: 42px;
    color: #333;
  }

  .welcome .title{
    font-size: 40px;
    line-height: 62px;
    color: #0075ff;
  }
 
  .welcome .description{
    font-size: 14px;
    color: #999;
    text-align: right;
  }

  .welcome .img{
    background-image: url("../assets/images/images/welcome.png");
    background-size: cover;
    width: 640px;
    height: 360px;
  }
</style>