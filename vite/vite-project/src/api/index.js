// api管理
import request from "../utils/requst";


//http :localhost:3000/api/user/login
export function login(data){
    return request.post("/user/login",data);
}

export function notify(){
    return request.get("/notify/count",true);
}

export function menuList(params){
    return request.get("/menu/list",params)
}

export function userList(params){
    return request.get("/user/list",params)
}

export function userDelete(params){
    return request.post("/user/delete",params)
}

export function rolesList(){
    return request.get("/roles/list",true) 
}

export function deptList(){
    return request.get("/dept/list",true) 
}

//编辑  &&  新增
export function operate(params){
    return request.post("/user/operate",params)
}

//菜单的编辑 删除 创建
export function menuOperate(params){
    return request.post("/menu/operate",params)
}
