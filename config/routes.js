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
 
  ///-------------------------浏览器界面操作----------------BEGIN
  //用户操作：增删改更新及验证
  app.get('/posts', function (req, res, next){ user.index(req, res, db, next) }); 
  app.post('/create', function (req, res, next){ user.create(req, res, db, next) }); 
  app.get('/addFriend',function(req,res,next){user.addFriend(req,res,db,next) });
  app.get('/getFriends',function(req,res,next){ user.getFriends(req,res,db,next) });
  app.get('/auth',function(req,res,next){user.auth(req,res,next) });
  app.post('/login',function(req,res,next){user.login(req,res,db,next) });
  app.get('/checkUnique',function(req,res,next){user.checkUnique(req,res,db,next) });
  app.get('/logout',function(req,res,next){ user.logout(req,res,next) });
  //map
  app.get('/getMobilePosition',function(req,res,next){console.log("aaaa");user.getPosition(req,res,next)});
  //微博操作：
  app.post('/create_w',function(req,res,next){ weibo.create(req,res,db,next)});
  app.get('/getMyWeibo',function(req,res,next){ weibo.getMyWeibo(req,res,db,next)});
  ///-------------------------浏览器界面操作----------------END
  ///-------------------------移动客户端操作----------------BEGIN
  app.get('/m_join',function(req,res,next){ mobile.join(req,res,next) });//移动端加入进来
  app.get('/m_apart',function(req,res,next){res.send("aaa")});//移动端退出
  app.get('/m_sendGPS',function(req,res,next){mobile.sendGPS(req,res,next) });//移动端将自己GPS数据发送给服务器
  app.get('/m_showall',function(req,res,next){});//移动端请求查看所有在线人员
  app.get('/m_watch',function(req,res,next){});//移动端监控某个在线人员
  app.get('/m_all',function(req,res,next){});//移动端获取所有在线人员
  ///-------------------------移动客户端操作----------------END

}
