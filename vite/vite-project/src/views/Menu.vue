<template>
    <div class="user-manage">
        <!-- 用户查询 -->
        <div class="query-form">
             <el-form :inline="true" :model="menu" ref="ruleFormRef">
               <el-form-item label="菜单名称" prop="menuName">
                 <el-input v-model="menu.userId" placeholder="请输入菜单名称" />
               </el-form-item>

               <el-form-item label="菜单的状态" prop="menuState">
                <el-select v-model="menu.menuState" placeholder="菜单状态">
                   <el-option label="正常" :value="1" />
                   <el-option label="禁用" :value="2" />
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
              <el-button type="primary" @click="handleAddMenu(dialogFormRef)">创建</el-button>
            </div>

            <el-table :data="tableData" style="width: 100%" row-key="_id">
              <el-table-column
              v-for="item in colums"
               :prop="item.prop" 
               :label="item.lable" 
               :formatter="item.formatter"
               :width="item.width"
               />

            <el-table-column fixed="right" label="操作" width="220">
              <template #default="scope">
                <el-button  type="primary" size="small" @click="handleAddMenu(dialogFormRef,scope.row)">新增</el-button>
                <el-button  type="warning" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button  type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>

            </el-table>
        </div>
        <!-- 新增用户 -->
        <el-dialog
          v-model="centerDialogVisible"
          :title="title"
          align-center
        >
          <el-form ref="dialogFormRef" :model="menuForm" :rules="rules" label-width="100px" status-icon="true">
            <el-form-item label="父级菜单" prop="parentId">
              <el-cascader 
              :options="tableData"
              :props ="{checkStrictly:true,value:'_id',label:'menuName'}"
              placeholder="选择"
              clearable />
              <span class="tip">不选，则直接创建一级菜单</span>
            </el-form-item>

            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="menuForm.menuType">
                <el-radio :label="1" >菜单</el-radio>
                <el-radio :label="2" >按钮</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="菜单名称" prop="menuName">
                <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
            </el-form-item>

            <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType == 1">
                <el-input v-model="menuForm.icon" placeholder="请输入图标" />
            </el-form-item>

            <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType == 1"> 
                <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
            </el-form-item>

            <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType == 2">
                <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
            </el-form-item>

            <el-form-item label="菜单状态" prop="menuState">
              <el-radio-group v-model="menuForm.menuState">
                <el-radio :label="1" >正常</el-radio>
                <el-radio :label="2" >禁用</el-radio>
              </el-radio-group>
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
import {menuList,menuOperate} from "../api/index";
import { ElMessage } from "element-plus";

const menu = reactive({
    menuState:"",
    menuName:"",
    state:1
})

const ruleFormRef = ref();
const dialogFormRef = ref();
const centerDialogVisible = ref(false);
const action = ref("");
const title = ref("用户新增");

let menuForm = reactive({
  menuType:1,
  menuState:1
});

let  tableData = ref();

const handleChange = (value) => {
  console.log(value)
}

const userForm = reactive({
  state:3
});

const colums = reactive([
    {lable:"菜单名称",prop:"menuName"},
    {lable:"图标",prop:"icon"},
    {lable:"菜单类型",prop:"menuType",formatter(row,column,value){
      return {
        1:"菜单",
        2:"按钮",
      }[value];
    }},
    {lable:"权限标识",prop:"menuCode"},
    {lable:"路由地址",prop:"path"},
    {lable:"菜单状态",prop:"menuState",formatter(row,column,value){
      return {
        1:"正常",
        2:"禁用"
      }[value]
    }}
])

const rules = reactive({
  menuName:[
    {required:true,message:"菜单名称不能为空",trigger:"blur"},
    {min:4,max:6,message:"菜单名称字符在4—6之间"}
  ]
})

//获取餐单列表
async function getMenuList(){
  let params = {...menu}
  const res = await menuList(params);
  console.log(res)
  const list = res.data.data;
  tableData.value = list;
}

// 进行查询
function handleQuery(){

}

function handleReset(formEl){
  if (!formEl) return
  formEl.resetFields()
}

async function handleDelete(row){
  await menuOperate({
    _id:[row._id],
    action:"delete"
  });
  //删除成功调用
  ElMessage.success("删除成功");
  getMenuList();
}

function handleClose(formEle){
  centerDialogVisible.value = false;
  handleReset(formEle)
}

function handleSubmit(formEle){
  if(!formEle) return;
  formEle.validate(async (valid)=>{
    if(valid){
      let params = toRaw(menuForm); // 普通对象   编辑窗口  共用 新增窗口
      params.action = action.value;
      const res = await menuOperate(params);
      //operate 编辑 
      if(res.status === 200 && res.data.code == 200){
        centerDialogVisible.value = false;
        //确认一下，是编辑还是新增，给个提示
        const message = action.value === "edit" ? "修改成功" : "新增成功"
        ElMessage.success(message);
        handleReset(formEle);
        getMenuList();
       }
      }
    }
    );
}

// 编辑 按钮点击函数
function handleEdit(row){
  action.value = "edit";  //当action的值为edit的时便是是再编辑
  title.value = "修改菜单或按钮信息"
  centerDialogVisible.value = true;
  nextTick(()=>{
  // 对象扩展
  Object.assign(menuForm,row);
  });
}

function handleAddMenu(formEle,row){
  console.log(row)   //为undefinded 表示点击的新增按钮，有值表示点击的是编辑
  action.value = "add";  //当action的值为edit的时便是是再编辑
  title.value = "菜单/按钮新增"
  if(row){
    menuForm.parentId = [...row.parentId,row.id].filter((item) => item)
  }
  centerDialogVisible.value = true;

  handleReset(formEle);
} 

//_id 当前菜单按钮的唯一标识，parentId父级的唯一标识
//用户管理二级菜单   parentId  ....

getMenuList();

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
.tip{
  padding-left: 20px;
}
</style>