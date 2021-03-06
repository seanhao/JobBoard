var app=require('koa')();
var swig=require('koa-swig');
var router=require('koa-router')();
var static=require('koa-static');
var mongoose=require('mongoose');
var bodyParser = require('koa-bodyparser');
var session=require('koa-session');

var path=require('path');

var config = require('./config/config.js');
var route=require('./routes/route.js');
var admin_route=require('./routes/admin_route.js');

// swig template
app.context.render=swig({
	root:path.join(__dirname,'views'),
	autoescape:true,
	cache:'memory',
	ext:'html',
});

// 初始化配置
require('./config/init.js')(app, mongoose);

// 靜態文件middleware
app.use(static(__dirname+'/public'));

// middleware
app.use(bodyParser());

// session
app.keys=[config.cookieSecret];
app.use(session(app));

// route
admin_route(router);
route(router);
app.use(router.routes());

// 錯誤處理
app.use(function *(next) {
	this.status=404;
	this.body='404 Not Found!';
});

app.on('error',function (err,ctx) {
	if (process.env.NODE_ENV!='production') {
		this.body='500 server error';
		console.error(err.message);
		console.error(err);
	}
});

app.use(function *() {
	throw new Error('server error');
});

app.listen(3000);
console.log('app is listening on 3000 port'); 