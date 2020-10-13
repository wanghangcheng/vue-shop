import express from 'express'
import config from './config'
import nunjucks from 'nunjucks'
import db from './../db/db'

import bodyParser from './../middle_wares/body_parser'
import errorLog from './../middle_wares/error_log'
import loginPass from './../middle_wares/login_pass'

// 引入express-session
import session from 'express-session'
// 引入connect-mongo用于express连接数据库存储session
const mongoStore  = require('connect-mongo')(session);

// 3. 引入路由
import indexRouter from './../routes/index'
import appUserRouter from './../routes/appUser'
import cartRouter from './../routes/cart'
import addressRouter from './../routes/address'
import orderRouter from './../routes/order'

const app = express();

// 6. 使用session
app.use(session({
    secret: config.secret,
    name: config.name,
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:config.maxAge },
    rolling:true,
    store:new mongoStore({
        url:config.db_url,
        touchAfter: config.maxAge
    })
}));

// 1. 配置公共资源访问路径
app.use(express.static(config.publicPath));

// 2. 配置中间件（nunjucks模板引擎能够作用到views文件夹中的模板）
nunjucks.configure(config.viewsPath, {
    autoescape: true,
    express: app,
    noCache: true // 不使用缓存，模板每次都会重新编译
});

// 5. 配置数据处理的中间件
app.use(bodyParser);

// 7. 配置后端拦截中间件
app.use(loginPass);

// 4. 挂载路由
app.use(indexRouter);
app.use(appUserRouter);
app.use(cartRouter);
app.use(addressRouter);
app.use(orderRouter);


// 5. 挂载错误中间件
app.use(errorLog);

app.use((req, res)=>{
    res.render('404.html');
});


app.listen(config.port, ()=>{
    console.log(`服务器已经启动, 端口是: ${config.port}`);
});
