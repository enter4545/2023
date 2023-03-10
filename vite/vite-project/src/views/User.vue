<template>
    <div class="user-manage">
        <!-- 用户查询 -->
        <div class="query-form">
             <el-form :inline="true" :model="user" ref="ruleFormRef">
               <el-form-item label="用户ID" prop="userId">
                 <el-input v-model="user.userId" placeholder="用户ID" />
               </el-form-item>

               <el-form-item label="用户名称" prop="userName">
                 <el-input v-model="user.userName" placeholder="用户名" />
               </el-form-item>

               <el-form-item label="用户状态" prop="state">
                 <el-select v-model="user.state" placeholder="用户状态">
                   <el-option label="所有" :value="0" />
                   <el-option label="在职" :value="1" />
                   <el-option label="离职" :value="2" />
                   <el-option label="试用期" :value="3" />
                 </el-select>
               </el-form-item>

               <el-form-item>
                 <el-button type="primary" @click="handleQuery()">查询</el-button>
                 <el-button @click="handleReset(ruleFormRef)">重置</el-button>
               </el-form-item>
             </el-form>
        </div>
        <!-- 用户列表 -->
        <div class="base-table">
            <div class="action">
              <el-button type="primary" @click="handleAddUser(dialogFormRef)">新增</el-button>
              <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
            </div>

            <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionsChange">
              <el-table-column type="selection" width="55"/>
              <el-table-column
              v-for="item in colums"
               :prop="item.prop" 
               :label="item.lable" 
               :formatter="item.formatter"
               :width="item.width"
               />

            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button  type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button  type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>

            </el-table>

            <el-pagination 
            class="pagination"
            background layout="prev, pager, next" 
            :total="pager.total"
            @current-change="handleCurrentChange"
             />
        </div>
        <!-- 新增用户 -->
        <el-dialog
          v-model="centerDialogVisible"
          :title="title"
          align-center
        >
          <el-form ref="dialogFormRef" :model="userForm" :rules="rules" label-width="100px" status-icon="true">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="userForm.userName" placeholder="请输入用户名" :disabled="action === 'edit'"/>
            </el-form-item>
            <el-form-item label="邮箱" prop="userEmail">
              <el-input v-model="userForm.userEmail" placeholder="邮箱地址" :disabled="action === 'edit'">
                <template #append>@mashibing.com</template>
              </el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="userForm.mobile" placeholder="手机号码"/>
            </el-form-item>
            <el-form-item label="岗位" prop="job">
              <el-input v-model="userForm.job" placeholder="岗位"/>
            </el-form-item>
            <el-form-item label="状态" prop="state">
              <el-select v-model="userForm.state" placeholder="用户状态">
                   <el-option label="在职" :value="1" />
                   <el-option label="离职" :value="2" />
                   <el-option label="试用期" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="系统角色" prop="roleList">
              <el-select v-model="userForm.roleList" placeholder="请选择系统角色" multiple style="width:100%">
                <el-option
                v-for="role in allRolesList"
                :key="role._id"
                :label="role.roleName"
                :value="role._id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门" prop="deptId">
              <el-cascader 
              placeholder="请选择所属部门"
              v-model="userForm.deptId" 
              :options="allDeptList"
              :props="{label:'deptName',value:'_id'}"
               @change="handleChange" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="handleClose(dialogFormRef)">取消</el-button>
              <el-button type="primary" @click="handleSubmit(dialogFormRef)">确认</el-button>
            </span>
          </template>
        </el-dialog>
    </div>
</template>

<script setup>
import {reactive,ref,toRaw,nextTick} from "vue";
import {userList,userDelete,rolesList,deptList,operate} from "../api/index";
import { ElMessage } from "element-plus";

const user = reactive({
    userId:"",
    userName:"",
    state:0
})

const ruleFormRef = ref();
const dialogFormRef = ref();
const chooseUserIds = reactive([]);
const centerDialogVisible = ref(false);
const action = ref("");
const title = ref("用户新增");
const allRolesList = reactive([]);
const allDeptList = reactive([]);

const tableData = reactive([]);
const pager = reactive({
  pageNum:1,
  pageSize:10
})

const handleChange = (value) => {
  console.log(value)
}

const userForm = reactive({
  state:3
});

const rules = reactive({
  userName:[
    {required:true,message:"手机号不能为空",trigger:"blur"}
  ],
  userEmail:[
    {required:true,message:"邮箱不能为空",trigger:"blur"}
  ],
  mobile:[
    {required:true,message:"手机号不能为空",trigger:"blur"},
    {pattern:/1\d{10}/,message:"请输入合法的手机号码",trigger:"blur"}
  ],
  roleList:[
    {required:true,message:"系统角色不能为空",trigger:"blur"}
  ],
  deptId:[
    {required:true,message:"所属部门不能为空",trigger:"blur"}
  ]
})

const colums = reactive([
    {lable:"用户ID",prop:"userId",width:"80pz"},
    {lable:"用户名",prop:"userName",width:"70pz"},
    {lable:"用户邮箱",prop:"userEmail"},
    {lable:"用户角色",prop:"role",formatter(row,column,value){
      return {
        1:"管理员",
        2:"普通用户"
      }[value]
    },width:"80pz"},
    {lable:"用户状态",prop:"state",formatter(row,column,value){
      return {
        1:"在职",
        2:"离职",
        3:"试用期"
      }[value]
    },width:"80pz"},
    {lable:"注册时间",prop:"createTime",formatter(row,column,value){
      let time = new Date(value);
      return time.toLocaleString()
    }},
    {lable:"最后登录时间",prop:"lastLoginTime",formatter(row,column,value){
      let time = new Date(value);
      return time.toLocaleString()
    }}
])

async function getUserList(){
  let params = {...user,...pager}
  const res = await userList(params);
  const {list,page} = res.data.data;
  tableData.push(...list);
  pager.total = page.total;
}

// 进行查询
function handleQuery(){
  getUserList();
}

function handleReset(formEl){
  if (!formEl) return
  formEl.resetFields()
}

function handleCurrentChange(val){
  pager.pageNum = val;
  getUserList()
}

async function handleDelete(row){
  await userDelete({
    userIds:[row.userId]
  });
  //删除成功调用
  ElMessage.success("删除成功");
  getUserList();
}

async function handleBatchDelete(){
  if(chooseUserIds.length === 0){
    ElMessage.error("批量删除用户不能为空")
    return
  }

  await userDelete({
    userIds:chooseUserIds
  });
  ElMessage.success("批量删除成功")
  getUserList()
}

let res = new Map();
function handleSelectionsChange(list){
list.filter(item =>{
  if(!res.has(item["userId"])){
    res.set(item["userId"],1)
    chooseUserIds.push(item.userId);
  }
})
}

//获取系统角色
async function getRolesList(){
  const res = await rolesList();
  allRolesList.push(...res.data.data);
  console.log(allRolesList);
}

async function getDeptList(){
  const res =   await deptList();
  allDeptList.push(...res.data.data);
  console.log(allDeptList)
}

function handleClose(formEle){
  centerDialogVisible.value = false;
  handleReset(formEle)
}

function handleSubmit(formEle){
  if(!formEle) return;
  formEle.validate(async (valid)=>{
    if(valid){
      let params = toRaw(userForm); // 普通对象   编辑窗口  共用 新增窗口
      params.userEmail += "@mashibing.com";
      params.action = action.value;
      const res = await operate(params);
      //operate 编辑
      if(res.status === 200){
        centerDialogVisible.value = false;
        //确认一下，是编辑还是新增，给个提示
        const message = action.value === "edit" ? "修改成功" : "新增用户成功"
        ElMessage.success(message);
        handleReset(formEle);
        getUserList();
       }
      }
    })
}

// 编辑 按钮点击函数
function handleEdit(row){
  action.value = "edit";  //当action的值为edit的时便是是再编辑
  title.value = "修改用户信息"
  centerDialogVisible.value = true;
  nextTick(()=>{
  // 对象扩展
  Object.assign(userForm,row);
  });
}

function handleAddUser(formEle){
  action.value = "add";  //当action的值为edit的时便是是再编辑
  title.value = "用户新增"
  centerDialogVisible.value = true;
  handleReset(formEle);
}

getUserList();
getRolesList();
getDeptList()

</script>

<style scoped>

.query-form{
    background: #fff;
    padding:20px;
    border-radius: 5px;
}
.base-table{
    border-radius: 5px;
    background: #fff;
    margin: 20px 0 20px 0;
}

.action{
  border-radius: 5px 5px 0px 0px;
  padding: 20px;
  border-bottom: 1px solid #ece8e8;
}

.pagination{
  padding: 14px;
  justify-content: flex-end;
}
</style>