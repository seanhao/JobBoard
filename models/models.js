var mongoose = require('mongoose');

// 帳號模式
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    priority: Number,
    name: String,
    date_birth: String,
    place_birth: String,
    nationality: String,
    marital_status: String,
    email: String,
    address: String,
    contact_no: String,
    work_exp: String,
    education: String,
    certification: String,
    language: String,
    skill: String,
    salt:String,//md5 salt
});
// 文章模式
var articleSchema = mongoose.Schema({
    title: String,
    author: String,
    company: String,
    content: String,
    condition: String,
    city: String,
    workplace: String,
    worktime: String,
    holiday: String,
    salary: String,
    number: String,
    contact: String,
    other: String,     //備註

    time: String,
    update_time: String,
    views:{//觀看次數
        type:Number,
        default:0
    },
   
});
// 評論模式
var commentSchema = mongoose.Schema({
    author: String,
    content: String,
    article_id: String,
    time: String,
   
});

// 綁定模型
var User = mongoose.model('User', userSchema);
var Article = mongoose.model('Article', articleSchema);
var Comment = mongoose.model('Comment', commentSchema);


exports.User = User;
exports.Article = Article;
exports.Comment = Comment;