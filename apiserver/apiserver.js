let createError = require('http-errors');
let express = require('express');
let fs = require('fs'); //用于读写文件 (node原生模块)
let path = require('path');
let logger = require('morgan');
const config = require('./config');
const httpError = require('http-errors');
let log = require('./common/log');
const jwtAuth = require('./common/jwt');
const OS = require('os');
const Cluster = require('cluster');
const ueditor_backend = require('ueditor-backend')
    // let { createOraclePool, closePoolAndExit } = require('./common/oracle')
let indexRouter = require('./routes/index');
let categoryRouter = require('./routes/category');
let articleRouter = require('./routes/article');
let wuserRouter = require('./routes/weapp/wuser');
let wtodoRouter = require('./routes/weapp/wtodo');
let wnoteRouter = require('./routes/weapp/wnote');



let app = express();
let http = require('http');

// 启动数据库连接池
// createOraclePool();

let httpServer = http.createServer(app)


httpServer.listen(config.port, () => {
    log.info('http服务端口号 : ' + config.port);
});





//使服务可被跨域请求
let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , X-Token');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
            //让options请求快速返回 s
    } else {
        next();
    };
}

app.use(allowCrossDomain);


app.use(logger('dev')); // 拦截http请求 打印请求日志
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));


// 配置静态资源
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/utf8-php', express.static(path.join(__dirname, 'dist/utf8-php')));
app.use('/static', express.static(path.join(__dirname, 'dist/static')));
app.use('/css', express.static(path.join(__dirname, 'dist/css')));
app.use('/js', express.static(path.join(__dirname, 'dist/js')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 使用身份认证中间件
// app.use(jwtAuth);

app.use(function(req, res, next) {
    log.info(`访问 ${req.path} 接口`);
    next();
});

app.use('/', indexRouter);


// 二级路由转发
app.use('/category', categoryRouter);
app.use('/article', articleRouter);
app.use('/wuser', wuserRouter);
app.use('/wtodo', wtodoRouter);
app.use('/wnote', wnoteRouter);


ueditor_backend(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    if (err.name === 'UnauthorizedError') {
        //这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
        res.status(200).json({
            code: 50014,
            data: null,
            msg: "登录凭据已过期，请重新登录..."
        })
    } else {
        res.status(err.status || 500);
        res.json({
            error: err
        })
    }
});

module.exports = app;