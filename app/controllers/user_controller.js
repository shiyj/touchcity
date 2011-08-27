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
    post_handler(req, function(request_data){
      console.log(request_data.username);
      console.log(request_data);
      req.session.auth = true;
      res.send({success:true});
      res.end();
    });
    return;
  }
  res.send('unauthed');
  return;
}

function post_handler(request, callback)
{
  var _REQUEST = { };
  var _CONTENT = '';

  //if (request.method == 'POST'){
    request.addListener('data', function(chunk)	{
      _CONTENT+= chunk;
      console.log("Received POST data chunk '"+chunk + "'.");
	  });

	  request.addListener('end', function(){
      _REQUEST = querystring.parse(_CONTENT);
      console.log('post data finish receiving: ' + _CONTENT );
	    callback(_REQUEST);
	  });
  //};
};

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
