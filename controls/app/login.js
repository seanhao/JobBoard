var models=require('../../models/models.js');
var crypto=require('crypto');

module.exports={
	home:function *(next) {
		yield this.render('app/login.html',{title:'登入'});
	},
	handleLogin:function *(next) {
		var username=this.request.body.username;
		var password=this.request.body.password;

		var md5=crypto.createHash('md5');

		try {
			var user=yield models.User.findOne({username:username});

			//密碼加密
			password=md5.update(password+user.salt,'utf8').digest('base64');

			if (password===user.password) {
				this.session.username=username;
				this.session.priority=user.priority;
				//console.log("使用者權限:"+this.session.priority);
				this.redirect('/');
			}else{
				this.body='密碼錯誤';
			}
		} catch(e) {
			this.body='登入失敗,無此帳號';
			console.log(e);
		}
	}
}