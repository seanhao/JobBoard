module.exports=function *(next) {
	this.session.username=null;
    this.session.priority=null;
	this.status=303;
	this.redirect('/');
}