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
    if (err) return next(err)
      res.send({success:true});	
  });
}

exports.getfriend = function(req,res,db,next){
  db.users.getUsers(function(err,users){
      if(!err){
        var jsonstr=new Array();
        for(var u in users){
          jsonstr.push({text:users[u].doc.username,leaf:true})
        }
        res.json({text:".",children:jsonstr});
      }      
  });
}

exports.auth = function(req,res,next){
 authCheck(req,res,next); 
}
exports.login = function(req,res,db,next){
  var username=req.param('username');
  var password=req.param('password');
  db.users.checkLogin(username,password,function(err,docs){
    if(docs.length){
      req.session.auth = true;
      res.send({success:true});
    } else {
      res.send({success:false});
    }
  })
}
exports.logout = function(req,res,db,next){
  
}
