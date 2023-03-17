const mongoose = require('mongoose');
const menuSchema = mongoose.Schema({
    menuName:String,
    menuType:Number, //菜单类型
    menuState:Number, //菜单状态
    menuCode:String,//权限标识
    path:String,  //路由地址
    icon:String,
    parentId:[mongoose.Types.ObjectId],
    createTime:{
        type:Date,
        default:new Date()
    },
    updataTime:{
        type:Date,
        default:new Date()
    }
})


//关系绑定   Odm ORM
module.exports = mongoose.model('Menu',menuSchema,'menus')