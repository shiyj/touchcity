var url = require('url');
var authCheck= function(req,res,next){
  var params = req.urlpa = url.parse(req.url, true).query;
  if ( url.pathname == "/logout" ) {
      req.session.destroy();
  }

  if (req.session && req.session.auth == true) {
      next();
      return;
  }

  if ( url.pathname == "/login" && 
         url.query.name == "max" && 
         url.query.pwd == "herewego"  ) {
      req.session.auth = true;
      next();
      return;
  }

  res.writeHead(403);
  res.end('Sorry you are unauthorized.\n\nFor a login use: /login?name=max&pwd=herewego');
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
  
}
exports.login = function(req,res,db,next){
  
}
exports.logout = function(req,res,db,next){
  
}
