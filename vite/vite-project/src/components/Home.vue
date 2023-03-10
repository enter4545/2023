<template>
    <div class="container">
        <div :class="['side',isCollapse? 'collapse' : 'expend']">
          <!-- 系统logo -->
          <div class="logo" >
            <img src="../assets/images/images/logo.webp" alt="">
            <span v-if="!isCollapse">manager</span>
          </div>
        <!-- 导航菜单 -->
          <el-menu
            default-active="2"
            class="el-menu-vertical"
            background-color="#001529"
            text-color="#fff"
            :collapse="isCollapse"
            router
           >
           <tree-menu :userMenu="userMenu"></tree-menu>
          </el-menu>
        </div>
        <div :class="['content-right',isCollapse? 'collapse' : 'expend']">
            <div class="nav-top">
                <div class="menu">
                  <el-icon  @click="toggle"><Fold /></el-icon>
                  <span>
                    <bread-crumb/>
                  </span>
                </div>
                <div class="user-info">
                  <el-badge :is-dot=" notfiyCount > 0 ? true : false" class="notfiy">
                    <el-icon><Bell /></el-icon>
                  </el-badge>
                  <el-dropdown @command="handleLogout">
                    <span class="el-dropdown-link">
                      {{user.userName}}
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="email">邮箱:{{ user.userEmail }}</el-dropdown-item>
                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
            </div>
            <div class="wrapper">
                    <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref,computed,reactive} from "vue"
import {useRouter}  from 'vue-router';
import {useStore} from 'vuex';
import {notify,menuList} from "../api/index";
import TreeMenu from "./TreeMenu.vue";
import BreadCrumb from "./BreadCrumb.vue";


const route = useRouter();
const store = useStore();
let isCollapse = ref(false)

const notfiyCount = ref(0);
const userMenu = reactive([]);

const user = computed(()=>store.state.userInfo.data);  //获取vuex 用户信息

function handleLogout(command){
  if(command === "logout"){
    store.commit("saveUserInfo","");
    route.push("/login")
  }
}

function toggle(){
  isCollapse.value = !isCollapse.value
}

async function getNotifyCount(){
  const res = await notify();
  notfiyCount.value = res.data.count;
}

async function getMenuList(){
  const res = await menuList();
  userMenu.push(...res.data.data)
}
 
getNotifyCount();
getMenuList();
</script>

<style scoped>
  .container{
    position: relative;
  }
  .side{
    padding-top: 10px;
    position: fixed;
    width: 200px;
    height: 100%;
    color: #fff;
    background-color: #001529;
    transition:width 0.5s;
  }

  .side.collapse{
    width: 80px;
  }

  .side.expand{
    width: 200px;
  }
  .el-menu{
    border-right: none;
  }

  
  .el-menu-vertical{
    height: calc(100vh - 100px);
  }
  .content-right{
    margin-left: 200px;
  }

  .content-right.collapse{
    margin-left: 80px;
  }

  .content-right.expand{
    margin-left: 200px;
  }
  .nav-top {
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;/*flex item 两端对齐*/
    padding: 0 20px;
    border-bottom: 1px solid #999;
  }
  .wrapper{
    background-color: #eef0f3;
    height: calc(100vh - 50px);
    padding: 20px;
  }

  .menu, .user-info{
    display: flex;
    align-items: center;
  }

.user-info{
  margin-right: 20px;
}
  .menu span, .user-info span {
    padding-left: 10px;
    font-size: 16px;
  }
  .user-info .notfiy{
    line-height: 16px;
  }

  .container .side .logo{
    display: flex;
  }

  .container .side .logo img{
    width: 60px;
    height: 60px;
    margin-left: 10px;
  }

  .container .side .logo span{
    font-size: 18px;
    padding-left: 20px;
    vertical-align: middle;
    line-height: 55px;
  }
</style>