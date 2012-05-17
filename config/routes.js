/**
 * 加载 controllers
 */

const user   = require('../app/controllers/user_controller');
const weibo  = require('../app/controllers/weibo_controller');
const mobile = require('../app/controllers/mobile_controller');
/**
 * Exports
 */
 
module.exports = function(app){
  
  //  Load database and pass it down to the controllers
  
  var db = app.set('db');

  
  app.get('/', function (req, res,next){
	//user.index(req, res, db, next) 
	res.render('desktop',{layout: false});
  });
  app.get('/user_acc',function(req,res,next){
	res.render('user_acc');
  });
 
  //用户操作：增删改更新及验证
  app.get('/posts', function (req, res, next){ user.index(req, res, db, next) }); 
  app.post('/create', function (req, res, next){ user.create(req, res, db, next) }); 
  app.get('/addFriend',function(req,res,next){user.addFriend(req,res,db,next) });
  app.get('/getFriends',function(req,res,next){ user.getFriends(req,res,db,next) });
  app.get('/auth',function(req,res,next){user.auth(req,res,next) });
  app.post('/login',function(req,res,next){user.login(req,res,db,next) });
  app.get('/checkUnique',function(req,res,next){user.checkUnique(req,res,db,next) });
  app.get('/logout',function(req,res,next){ user.logout(req,res,next) });
  //移动客户端操作
  app.post('/m_sendGPS',function(req,res,next){});
  app.post('/m_join',function(req,res,next){ mobile.join(req,res,next) });
  app.post('/m_apart',function(req,res,next){});
  
  //微博操作：
  app.post('/create_w',function(req,res,next){ weibo.create(req,res,db,next)});
  app.get('/getMyWeibo',function(req,res,next){ weibo.getMyWeibo(req,res,db,next)});
}
