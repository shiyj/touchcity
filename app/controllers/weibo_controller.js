exports.getMyWeibo = function(req,res,db,next){

}
exports.create = function(req,res,db,next){
  var Weibo = db.main.model('Weibo');
  var weibo1 = new Weibo({userid:req.session.auth_id,msg:req.param('msg'),isFather:req.param('isFather')});
  weibo1.save(function(err){
    if(!err)
      res.send({success:true});
    else
      res.send({success:false});
  });

}
