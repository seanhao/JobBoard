var models=require('../../models/models.js');
var crypto=require('crypto');
var nodemailer = require('nodemailer');
//email verification transporter
var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'jobboard.ga@gmail.com',
        pass: 'yourpassword'
    }
});
//Allow less secure apps: https://myaccount.google.com/lesssecureapps
module.exports={
	home:function *(next) {
		yield this.render('app/register.html',{title:'註冊'});
	},
	verification:function *(next) {
		yield this.render('app/verification.html',{title:'驗證成功！'});
	},
	handleRegister:function *(next) {
		try {
			var user={
				username:this.request.body.username,
				password:this.request.body.password,
				email:this.request.body.email,
				priority: 1,//一般使用者權限值=1 欲創造管理者使用mongo輸入以下指令
				//db.users.update( { "username": "使用者名稱" },{ $set : { priority :2} })
			};
			var md5=crypto.createHash('md5');
			user.salt=new Date()+user.username;//md5 salt
			user.password=md5.update(user.password+user.salt,'utf8').digest('base64');//md5加鹽加密
			console.log('pass:'+user.password);

			var result=yield models.User.find({username:user.username});
			if (result.length==0) {
				yield models.User.create(user);

				//mail verification
				const mailOptions = {
  				from: 'Jobboard.ga <jobboard.ga@gmail.com>', // sender address
  				to: this.request.body.email, // list of receivers
  				subject: '驗證您的Jobboard.ga信箱', // Subject line
  				html: '<p>點擊 <a href="http://localhost:3000/verification">此處</a> 進行驗證，已開啟發文留言權限</p>'// plain text body
				};
				//html: '<p>點擊 <a href="http://localhost:3000/verification' + user.password + '">此處</a> 進行驗證，已開啟發文留言權限</p>'
				transporter.sendMail(mailOptions, function (err, info) {
   				if(err)
     				console.log(err)
   				else
     				console.log(info);
				});

				//session
				this.session.username=user.username;
				this.status=303;
				this.redirect('/');
			}else{
				this.body='此帳號已存在';
			}
		} catch(e) {
			this.body='註冊失敗';
			console.log(e);
		}
	},
	/*handleVerification:function *(next) {
		try {

				
			}else{
				this.body='此帳號已存在';
			}
		} catch(e) {
			this.body='註冊失敗';
			console.log(e);
		}
	}*/
}