const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const log4js = require("./utils/log4j");
const router = require('koa-router')();
const index = require('./routes/index')
const users = require('./routes/users')
const jwt = require('koa-jwt');
const utils = require("./utils/index")

//连接数据库
require("./config/db");

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))



app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger  next 机制  中间键
app.use(async (ctx, next) => {
  await next().catch((error)=>{
    if(error.status === 401){
      ctx.body = utils.fail("未携带token令牌或者token令牌已过期",50001)
    }
  });
})
//jwt 验证接口
app.use(jwt({secret:"mashibing"}).unless({
  path:["/api/user/login"]
}))


//一级路由
router.prefix('/api')

router.get("/notify/count",(ctx)=>{
  ctx.body = "body";
});

router.use(users.routes());

// routes
app.use(index.routes(), index.allowedMethods())
app.use(router.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
  log4js.error(err);
});

module.exports = app
