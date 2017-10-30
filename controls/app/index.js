var models=require('../../models/models.js');
module.exports={
	//首頁
	home:function *(next) {
		try {
			var posts=yield models.Article.find({}).sort({_id:-1});
			var hotPosts=yield models.Article.find({}).limit(5).sort({views:-1});
			if (this.session.username) {
				var username=this.session.username;
				console.log('首頁權限'+this.session.priority)
				var priority=this.session.priority;
			}
			yield this.render('app/index.html',{
				title:'首頁',
				title_eng:'home',
				username:username,
				priority:priority,
				posts:posts,
				hotPosts:hotPosts
			});
		} catch(e) {
			this.body='載入失敗';
			console.log(e);
		}
	},
	delete:function *(next) {
		var id=this.query.id;
		try {
			yield models.Article.remove({_id:id});
			this.status=303;
			this.redirect('/');
		} catch(e) {
			this.body='刪除失敗';
			console.log(e);
		}
	},
}