/**
 * 加载 controllers
 */

const user   = require('../app/controllers/user_controller');
var fs=require('fs');
/**
 * Exports
 */
 
module.exports = function(app){
  
  //  Load database and pass it down to the controllers
  
  var db = app.set('db');

  //  Load Root
  
  app.get('/', function (req, res,next){
	user.index(req, res, db, next) 
  });

  app.get('/desktop',function(req,res,next){
	//res.contentType('application/json');
	res.render('desktop',{layout: false});
  });
  
  app.get('/posts', function (req, res, next){ user.index(req, res, db, next) }); 
  app.post('/create', function (req, res, next){ user.create(req, res, db, next) }); 
  app.get('/allfriend',function(req,res,next){
      user.getfriend(req,res,db,next);
  });
  app.get('/auth',function(req,res){
    res.json({success:true});
  });
  app.get('/login',function(req,res){
    
  });
}
