const log4js = require("log4js");
log4js.configure({
    appenders:{
        out:{type:"file",filename:"test.log"}
    },
    categories:{
        default:{appenders:["out"],level:"error"}
    }
})
const logger = log4js.getLogger("globle-test.js");
logger.level = "debug";
logger.debug("some debug message")