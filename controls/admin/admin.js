var models=require('../../models/models.js');

module.exports={
	home:function *(next) {
		try {
			if (this.session.priority>1){
				var posts= yield models.Article.find({}).sort({_id:-1});
				console.log(posts)
				console.log(posts.title)
				yield this.render('admin/admin.html',{
				posts:posts,
				title:'所有使用者工作管理',
				title_eng:'Job Admin',
				username:this.session.username
			});
			}
			else{
			var posts= yield models.Article.find({author:this.session.username});
			console.log(posts)
			console.log(posts.title)
			yield this.render('admin/admin.html',{
				posts:posts,
				title:'工作管理',
				title_eng:'Job manager',
				username:this.session.username
			});}
		} catch(e) {
			this.body='錯誤';
			console.error(e);
		}
		
	},
	delete:function *(next) {
		var id=this.query.id;
		try {
			yield models.Article.remove({_id:id});
			this.status=303;
			this.redirect('/admin');
		} catch(e) {
			this.body='刪除失敗';
			console.log(e);
		}
	},
	edit:function *(next) {
		try {
			var id=this.params.id;
			var post=yield models.Article.findById(id);
			yield this.render('admin/edit.html',{
				//title:post.title,
				post:post,
				username:this.session.username
			});
		} catch(e) {
			this.body='載入文章失敗';
			console.log(e);
		}

	},
	update:function *() {
		var id = this.params.id;
		
		//測試是否為正確文章id
		console.log("---------------"+id)
		
		var doc={
			title:this.request.body.title,
			content:this.request.body.content,
			author:this.session.username,
			company:this.request.body.company,
			condition:this.request.body.condition,
    		city:this.request.body.city,
    		workplace:this.request.body.workplace,
    		worktime:this.request.body.worktime,
    		holiday:this.request.body.holiday,
    		salary:this.request.body.salary,
    		number:this.request.body.number,
    		contact:this.request.body.contact,
    		other:this.request.body.other,
			update_time:new Date(),
		};
		try {
			yield models.Article.update({_id:id},{$set:doc});
			this.status=303;
			this.redirect('/admin');
		} catch(e) {
			this.body='修改失敗: '+e.message;
			console.log(e);
		}

	},
	profile:function *(next){
		try {
			//抓user資料
			var [user]=yield models.User.find({username:this.session.username});
			//  find結果為[{data}]
			
			yield this.render('admin/profile.html',{
				title:this.session.username+" 的個人資料",
				user:user,
				username:this.session.username,
			});
			
		} catch(e) {
			this.body='載入個人資料失敗';
			console.log(e);
		}
	},
	profile_edit:function *(next) {
		try {
			var [user]=yield models.User.find({username:this.session.username});
			yield this.render('admin/profile_edit.html',{
				//title:post.title,
				user:user,
				username:this.session.username
			});
		} catch(e) {
			this.body='載入個人資料修改頁面失敗';
			console.log(e);
		}

	},
	profile_update:function *() {
				
		var doc={
			name:this.request.body.name,
			date_birth:this.request.body.date_birth,
			place_birth:this.request.body.place_birth,
			nationality:this.request.body.nationality,
			marital_status:this.request.body.marital_status,
    		email:this.request.body.email,
    		address:this.request.body.address,
    		contact_no:this.request.body.contact_no,
    		work_exp:this.request.body.work_exp,
    		education:this.request.body.education,
    		certification:this.request.body.certification,
    		language:this.request.body.language,
    		skill:this.request.body.skill,
			update_time:new Date(),
		};
		try {
			yield models.User.update({username:this.session.username},{$set:doc});
			this.status=303;
			this.redirect('/admin/profile');
		} catch(e) {
			this.body='修改失敗: '+e.message;
			console.log(e);
		}

	},
	search:function *(next) {
		 /* body... */ 
	}
}