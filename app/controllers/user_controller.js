var url = require('url');
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

  if ( params.pathname == "/login" ){ 
      req.session.auth = true;
      res.send({success:true});
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
  var user = new User(req.param('user'));
  
  user.save(function(err){
    if (err) return next(err)
    res.redirect('home');
	
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
 authCheck(req,res,next);
}
exports.logout = function(req,res,db,next){
  
}
