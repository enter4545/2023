const env = import.meta.env.MODE
const envConfig = {
    development:{
        baseApi:"/api",
        mockApi:"https://www.fastmock.site/mock/a329988c8e719ace6ecd2665f13be600/api"
    },
    prod:{
        baseApi:"",
        mockApi:""
    },
    test:{
        baseApi:"",
        mockApi:""
    }
}

export default {
    env,
    mock:false,
    nameSpace:'manager',
    ...envConfig[env]  
};