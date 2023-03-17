const router = require('koa-router')()
const User = require('../models/userSchema')
const Counter = require('../models/counterSchema')
const util = require("../utils/index");
const jwt =  require('jsonwebtoken')
const md5 = require('md5')
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
  if(useName)params.useName = useName;
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
  if(action === "add"){
    if(!userName || !userEmail || !deptId){
      ctx.body = util.fail("员工昵称/邮箱/部门未填写");
      return;
    }
    //找到，然后自增,最后再返回出去
    const doc = await Counter.findOneAndUpdate({_id:"productid"},{$inc:{sequence_value:1}},{new:true})
    // 去重，res 有两种结果，null表示没有重复，res{...}有重复的
    const res = await User.findOne({$or:[{userName},{userEmail},{mobile}]});
    console.log(res)
    if(res){
      ctx.body = util.fail("用户名/用户邮箱/手机号码已被注册");
      return;
    }else{
      const psd = mobile.substring(5,11)
      //没有重复，新增一条数据
      const user = new User({
        userId:doc.sequence_value,
        userName,
        userEmail,
        mobile,
        job,
        state,
        deptId,
        roleList,
        role:1,  // 状态为0 管理还是用户
        password:md5(psd)
      })
      user.save();
      ctx.body = util.success("用户创建成功")
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
      ctx.body = util.success("修改成功")
      return;
    }
  }
})

router.post("/delete",async (ctx)=>{
  const {userIds} = ctx.request.body;
  // 删除与批量删除   查询操作
  //通过updateMany $or找到userId  然后替换掉后面的
  // User.updateMany({$or:[{userId:100001,userId:100002}]},{state:2})
console.log(userIds)
  //环衬in运算符
 const res =  await User.updateMany({userId:{$in:userIds}},{state:2})
  if(res.modifiedCount){
    ctx.body = util.success(res,`删除成功${res.modifiedCount}条数据`);
    return;
  }
}) 

module.exports = router
