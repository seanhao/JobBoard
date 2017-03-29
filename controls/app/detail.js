var models=require('../../models/models.js');
module.exports={
	detail:function *(next) {
		try {
			var id=this.params.id;
			// 觀看次數+1
			yield models.Article.update({_id:id},{$inc:{views:1}});

			var post=yield models.Article.findById(id);
			//show comment
			var showcmts = yield models.Comment.find({article_id:id});
			//find之結果為[{xxxx}]故應命名為xxxx"s" 才能呼叫
			
			yield this.render('app/detail.html',{
				title:post.title,
				post:post,
				username:this.session.username,
				showcmts:showcmts,
			});
			
		} catch(e) {
			this.body='載入文章失敗';
			console.log(e);
		}
	},
	comment:function *(next) {
		var id = this.params.id;
		//console.log("========================="+id)
		//var post=yield models.Article.findById(id);

		var doc={
			content:this.request.body.content,
			author:this.session.username,
			article_id: id,
			time:new Date(),
		};
		try {
			yield models.Comment.create(doc);
			this.status=303;
			this.redirect(this.query.redirect || 'back');
		} catch(e) {
			this.body='評論失敗: '+e.message;
			console.log(e);
		}
	}
}