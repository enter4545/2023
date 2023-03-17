const log4js = require("./log4j")

const CODE = {      //状态码  Http 状态码
    SUCCESS:200,
    PARAM_ERROR:10001,   //参数错误
    USER_ACOUNT_ERROR:20001,   //账号或密码错误
    USER_LOGIN_ERROR:30001,    //用户未登录
    AUTH_ERROR:40001,          //认证失败或token过期
    BUSINESS_ERROR:50001       //业务请求失败
}


module.exports = {
    page(pageNum = 0,pageSize = 10){
        pageNum *= 1;
        pageSize *= 1;
        const skipIndex = (pageNum <= 0 ? 0 :pageNum-1 )*pageSize;
        return {
            page:{
                pageNum,
                pageSize
            },
            skipIndex,
        }
    },
    success(data='',msg='',code=CODE.SUCCESS){
        return {
            data,
            msg,
            code
        }
    },
    fail(msg='',code=CODE.USER_ACOUNT_ERROR){
        return {
            msg,
            code
        }
    }
}