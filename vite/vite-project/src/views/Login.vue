<template>
    <div class="login-wrapper">
        <div class="modal-content">
            <el-form
            ref="formRef"
            :model="ruleForm"
            :rules="rules"
            status-icon
            >
                <div class="title">ERP 后台管理系统</div>
                <el-form-item prop="userName">
                    <el-input 
                    type="text"
                     placeholder="用户名" 
                     prefix-icon="user"
                     v-model="ruleForm.userName"
                     ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input 
                    type="password" 
                    placeholder="用户密码" 
                    prefix-icon="view" 
                    v-model="ruleForm.password"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="btn-primary" @click="submitForm(formRef)">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref,reactive} from 'vue';
import { login } from "../api"
import {useRouter}  from 'vue-router'
import {useStore} from 'vuex'

const ruleForm = reactive({
    userName:'',
    password:'',
})
// 获取原生表单的句柄
const formRef= ref("");
const route = useRouter();
const store = useStore();

const rules = reactive({
    userName:[
        {required:true, message:"用户名不能为空",trigger:"blur"},
        {min:3,max:6, message:"用户名三到六位数",trigger:"blur"}
    ],
    password:[
        {required:true, message:"密码不能为空",trigger:"blur"},
        {min:6,max:12, message:"密码六到十二个字符",trigger:"blur"}
    ]
})
const submitForm = (elem)=>{
    if(!elem)return;
    elem.validate((valid)=>{
        if(valid){
            login(ruleForm).then(res=>{
                store.commit("saveUserInfo",res.data);
                route.push('/welcome')
            }).catch((error)=>{
                console.log(error)
            })
        }else{
            console.log("error:校验失败")
        }
    }
    )
}

</script>

<style scoped>
.login-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    background-color: #eee;
}
.modal-content{
    width: 500px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 10px 3px #999;
}
.title{
    font-size: 40px;
    line-height: 1.5;
    text-align: center;
    margin-bottom: 30px;
}
.btn-primary{
    width: 100%;
    height: 40px;
}
</style>