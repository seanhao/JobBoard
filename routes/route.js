var home=require('../controls/app/index.js');
var detail=require('../controls/app/detail.js');
var register=require('../controls/app/register.js');
var login=require('../controls/app/login.js');
var signout=require('../controls/app/signout.js');

module.exports=function (router) {
	router.get('/',home.home);
	router.get('/article/:id',detail.detail);

	//註冊
	router.get('/register',register.home);
	router.post('/handleRegister',register.handleRegister);
	router.get('/verification',register.verification);
	//登入
	router.get('/login',login.home);
	router.post('/handleLogin',login.handleLogin);

	//super delete
	router.get('/delete',home.delete);
    
    //評論
    router.post('/article/comment/:id',detail.comment);


	router.get('/signout',signout);
}