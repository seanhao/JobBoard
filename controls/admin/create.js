var models=require('../../models/models.js');

module.exports={
	show:function *(next) {
		yield this.render('admin/create.html',{
			title:'發布工作',
			title_eng: 'Add new job',
			username:this.session.username
		});
	},
	handleCreate:function *(next) {
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
			time:new Date(),
		};
		try {
			yield models.Article.create(doc);
			this.status=303;
			this.redirect('/admin');
		} catch(e) {
			this.body='發表失敗: '+e.message;
			console.log(e);
		}
		

	}
}