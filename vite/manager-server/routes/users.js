const router = require('koa-router')()
const User = require('../models/userSchema')
const util = require("../utils");
const jwt =  require('jsonwebtoken')
router.prefix('/user')    

router.post("/login",async(ctx,next) => {    //  ctx是什么
  const {userName,password} = ctx.request.body;
  //过滤掉password 不在前端展示
  const res = await User.findOne({                     //异步操作，加上了await
    userName,
    password
  },"userName");
  //这个username的意思是只保留userName

  const data = res._doc;    //可操控

  const token = jwt.sign({
    data:data
  },"mashibing",{expiresIn:300})

  if(res){
    data.token = token;
    ctx.body = util.success(data);
  }else{
    ctx.body = util.fail("账号或者密码错误")
  }
})

router.get("/list",async (ctx)=>{
  const {userId,useName,state,pageNum,pageSize} = ctx.request.query;
  const {page,skipIndex} = util.page(pageNum,pageSize);
  //格式化参数
  let params = {};
  if(userId)params.userId = userId;
  if(useName)params.userName = useName;
  if(state && state != "0")params.state = state;
  //根据条件查询用户列表
  const res = User.find(params,{_id:0,password:0}); 
   //这里的find是查询所有,后面的_id,password 意思是前端显示过滤掉这两个
  //res返回的是集合
  const list = await res.skip(skipIndex).limit(page.pageSize);
  const total = await User.countDocuments(params);

  ctx.body = util.success({
    page:{
      ...page,
      total
    },
    list
  })
})

router.post("/operate",async (ctx)=>{
  const {userId,userName,userEmail,mobile,job,state,roleList,deptId,action} = ctx.request.body;
  console.log(action)
  if(action === "add"){
    if(!userName || !userEmail || !deptId){
      ctx.body = util.fail("员工昵称/邮箱/部门未填写")
      return;
    }
  }
   if(action === "edit"){
    if(!deptId){
      ctx.body = util.fail("员工部门未填写")
      return;
    }
    const res = await User.findOneAndUpdate({userId},{mobile,job,state,roleList,deptId})
    //通过userId来查找，修改后面的
    if(res){
      ctx.body = util.success(res.userName,"修改成功")
      return;
    }
  }
})

module.exports = router
