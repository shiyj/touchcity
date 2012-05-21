const mobile = require('./mobile_controller');

var url = require('url');
var node_md5= require('../../lib/md5');

var authCheck= function(req,res,next){
  var params = req.urlpa = url.parse(req.url, true);
  if ( params.pathname == "/logout" ) {
    req.session.destroy();
    res.send({logout:'success'});
  }

  if (req.session && req.session.auth == true) {
    res.send({auth:true});
    return;
  }

  res.send('unauthed');
  return;
}


exports.index = function(req, res, db, next){
  res.render('home',{
		users: db.users.getUsers()	
	});
}

exports.create = function(req, res, db, next){
  var User = db.main.model('User');
  var password=node_md5.str_md5(req.param('password1'));
  var user = new User({username:req.param('username'),password:password,email:req.param('email')});
  
  user.save(function(err){
    if (err){
      console.log('err '+err);
      //用户名、email重复时测试errors类型
      for(var i in err)
        console.log('err one by one '+ i+ ' '+ err[i] );
      console.log('err errors '+err.errors);
      console.log('err type '+err.type);
      console.log('err message '+err.message);
      console.log('err username '+ err.username);
      console.log('err name '+ err.name);
      console.log('err message username '+err.message.username);
      console.log(err.errors);
      res.send({success:false});
      return;
      //return next(err)
    }
    res.send({success:true});	
  });
}
exports.addFriend = function(req,res,db,next){
  db.users.addFriend(req.session.auth_id,req.param('friendid'));
}
exports.getFriends = function(req,res,db,next){
  db.users.getFriends(req.session.auth_id,function(err,friends){
      if(!err){
        var jsonstr=new Array();
        for(var f=0;f< friends.friends.length;f++)
        jsonstr.push({text:friends.friends[f].username,leaf:true})
        res.json({text:".",children:jsonstr});
      }      
  });
}

exports.auth = function(req,res,next){
 authCheck(req,res,next); 
}
exports.login = function(req,res,db,next){
  var username=req.param('username');
  var password= node_md5.str_md5(req.param('password'));
  db.users.checkLogin(username,password,function(err,docs){
    if(docs.length){
      req.session.auth = true;
      req.session.auth_id=docs[0]._doc._id
      res.send({success:true});
    } else {
      res.send({success:false});
    }
  })
}
exports.logout = function(req,res,next){
  req.session.destroy();
  res.send('您已经退出……');
}
exports.checkUnique = function(req,res,db,next){
  var params = req.urlpa = url.parse(req.url, true).query;
  var coname=params.mykey;
  var covalue=params.myvalue;
  console.log('checkUnique of '+coname+ ' ==' +covalue);
  db.users.checkUnique(coname,covalue,function(err,doc){
    if(err) return res.send('服务器内部错误，请稍后注册……');
    if(doc.length!=0)
      res.send('已经存在.');
    else
    res.send(true);
  });
}
exports.getPosition = function(req,res,next){
  if (req.session && req.session.auth == true) {
    mobile.getPosition(req,res,next) 
  }
  else
    res.send({error: 'unlogin'});
}
