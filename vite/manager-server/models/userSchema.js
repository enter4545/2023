const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    userId:Number,
    userName:String,
    userEmail:String,
    password:String,
    state:{
        type:Number,
        default:1,//  1在职  2离职  3试用期
    },
    job:String,
    sex:String,
    mobile:String,
    role:{
        type:Number,
        default:1   // 1系统管理员   2用户
    },
    roleList:[],   //哪些系统角色
    deptId:[],
    createTime:{
        type:Date,
        default:new Date()
    },
    lastLoginTime:{
        type:Date,
        default:new Date()
    }
})


//关系绑定   Odm ORM
module.exports = mongoose.model('User',userSchema,'users')