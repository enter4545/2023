const router = require('koa-router')()
// const { deleteMany } = require('../models/menuSchema');
const Menu = require('../models/menuSchema')
const util = require("../utils/index");
router.prefix('/menu') 

router.get("/list",async (ctx)=>{
    const {menuName,menuState} = ctx.request.query   //访问的数据的参数
    let params = {}
    if(menuName)params.menuName = menuName;
    if(menuState)params.menuState = menuState;
    let menuList = await Menu.find(params);
    ctx.body = util.success(menuList);
})

router.post('/operate',async (ctx)=>{
    const {_id,action,...params} = ctx.request.body;
    if(action === "add"){
        const res = await Menu.create(params);
        ctx.body = util.success(res,"创建成功")
    }

    if(action === "edit"){
        const res = await Menu.findByIdAndUpdate(_id,params);
        ctx.body = util.success(res,"编辑成功")
    }

    if(action === "delete"){
        const res = await Menu.findByIdAndRemove(_id);
        //找到子菜单删除  parentId诗歌数组  【 id1 id2 】
        await  Menu.deleteMany({parentId:{$all:[_id]}})
        ctx.body = util.success(res,"删除成功")
    }
})

module.exports = router;

   
