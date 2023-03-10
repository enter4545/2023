import axios from "axios";
import config from "../config"
import { ElMessage } from "element-plus";
import router from "../router/index"
import storage from "./storage";

const NETWORK_ERROR = "网络请求异常，请稍后再试"

const instance = axios.create({
    baseURL:config.baseApi,
    timeout:8000
});

// 请求拦截
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const headers = config.headers;
    if(storage.getItem("userInfo")){
      const {token} = storage.getItem('userInfo').data || {token:""};
      if(!headers.Authorization)headers.Authorization="Bearer " + token;
    }
   //jwt token
    return config;
  });

// 响应拦截
instance.interceptors.response.use(function (response) {
    const {code,msg} = response.data;
    if(code === 200){
        response.data;
    }else if(code === 20001){
        ElMessage.error(msg);
        setTimeout(()=>{
          router.push('/login')
        },3000);
        return Promise.reject(msg);
    }else{
        ElMessage.error(msg || NETWORK_ERROR);
    }
    return response;
  });

  function request(options){
    options.method = options.method || "get";
    if(options.method.toLowerCase() === "get"){
      options.params = options.data;
    }

    // options.mock   //用户配置
    let isMock = config.mock   
    if(toString.call(options.mock) != '[object.Undefined]'){
      isMock = options.mock
    }   //全局的配置

    if(config.env === "prod"){
      instance.defaults.baseURL = config.baseApi;
    }else{
      instance.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
    }

    return instance(options);
  }

  ['get','post','put','delete'].forEach((item)=>{
    request[item] = (url,data,mock) => {
      if(data == undefined){
        data = {}
      }

      if(typeof data == "boolean"){
        mock = data;
        data = {};
      }
      // data = data == undefined ? {} : data;
      return request({
        url,
        data,
        mock,
        method:item
      })
    }
  })

  export default request;