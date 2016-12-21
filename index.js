
/**
 * Module dependencies.
 */

var logger = require('koa-logger');
var route = require('koa-route');
var koa = require('koa');
var app = module.exports = new koa();
var passport = require('passport');
//var FacebookStrategy = require('passport-facebook').Strategy;

/*passport.use(new FacebookStrategy({
    clientID: 196266540838526,
    clientSecret: 'c06fbcd1b6645bb0736d33c3567061d6',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.use(route.get('/auth/facebook',
  passport.authenticate('facebook')));

app.use(route.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }));

*/


// middleware

app.use(logger());

// route middleware
var routes = require('./routes.js');

app.use(route.get('/', routes.list));                  
/*首頁 list.html
 *module.exports.list = function *list() {
  var postList = yield posts.find({});
  this.body = yield render('list', { posts: postList });
};
*/


app.use(route.get('/post/result', routes.search)); 
app.use(route.get('/post/new', routes.add));  
app.use(route.get('/post/login', routes.login));          
/*進入創建頁面 new.js
 *module.exports.add = function *add() {
  this.body = yield render('new');
};
*/

app.use(route.get('/post/:id', routes.show));          
/*工作資料頁面 show.html
 *module.exports.show = function *show(id) {
  var post = yield posts.findOne({_id:id});
  if (!post) this.throw(404, 'invalid post id');
  this.body = yield render('show', { post: post });
};
*/

app.use(route.post('/post', routes.create));       // post會上傳資料 get則是載入頁面     
/*在new.html輸入完資料後上傳
 *<form action="/post" method="post">

 *module.exports.add = function *add() {
  this.body = yield render('new');
};
*/

app.use(route.post('/post/:id', routes.update));       
/*
 *module.exports.update = function *update(id) {
  var post = yield parse(this);
  yield posts.updateById(id, post);
  this.redirect('/post/' + id);
};
*/

app.use(route.get('/post/:id/edit', routes.edit));     
/*show.html
 *<li><a href="/post/{{ post._id.toString() }}/edit">修改</a></li>
 *module.exports.edit = function *edit(id) {
  var post = yield posts.findOne({_id:id});
  this.body = yield render('edit', { post: post });
};
*/

app.use(route.get('/post/:id/delete', routes.remove)); 
/*show.html
 *<li><a href="/post/{{ post._id.toString() }}/delete">刪除</a></li>
 *module.exports.remove = function *remove(id) {
  yield posts.remove({_id:id});
  this.redirect('/');
};
*/
//app.use(route.get('/post/search', routes.search)); 


var CSRF = require('koa-csrf').default


// trust proxy
app.proxy = true

// MongoDB
var mongoose = require('mongoose')
console.log('connecting to MongoDB...')
mongoose.connect(process.env.MONGODB_URI || 'localhost')

// sessions
var convert = require('koa-convert')
var session = require('koa-generic-session')
var MongoStore = require('koa-generic-session-mongo')

app.keys = ['your-session-secret', 'another-session-secret']
app.use(convert(session({
  store: new MongoStore()
})))

// body parser
var bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// csrf
app.use(new CSRF({
  invalidSessionSecretMessage: 'Invalid session secret',
  invalidSessionSecretStatusCode: 403,
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403
}))

// authentication
require('./auth')
var passport = require('koa-passport')
app.use(passport.initialize())
app.use(passport.session())

// routes
var fs    = require('fs')
//var route = require('koa-route')

app.use(route.get('/post/login', function(ctx) {
  ctx.type = 'html'
  var body = fs.readFileSync('views/login.html', 'utf8')
  ctx.body = body.replace('{csrfToken}', ctx.csrf)
}))

app.use(route.post('/custom', function(ctx, next) {
  return passport.authenticate('local', function(user, info, status) {
    if (user === false) {
      ctx.status = 401
      ctx.body = { success: false }
    } else {
      ctx.body = { success: true }
      return ctx.login(user)
    }
  })(ctx, next)
}))

// POST /login
app.use(route.post('/login',
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
))

app.use(route.get('/logout', routes.logout))

app.use(route.get('/auth/facebook',
  passport.authenticate('facebook')
))

app.use(route.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
))

app.use(route.get('/auth/twitter',
  passport.authenticate('twitter')
))

app.use(route.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
))

app.use(route.get('/auth/google',
  passport.authenticate('google')
))

app.use(route.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
))

// Require authentication for now
app.use(function(ctx, next) {
  if (ctx.isAuthenticated()) {
    return next()
  } else {
    ctx.redirect('/')
  }
})

app.use(route.get('/app', function(ctx) {
  ctx.type = 'html'
  ctx.body = fs.createReadStream('views/app.html')
}))


// listen
app.listen(3000);
console.log('listening on port 3000');