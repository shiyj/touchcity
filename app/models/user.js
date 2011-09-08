const Schema = require('mongoose').Schema
    , ObjectId = Schema.ObjectId;

var User = module.exports = new Schema({
    username      : { type: String, required: true, unique:true }
  , password      : { type: String, required: true }
  , email         : { type: String, required: true, unique:true }
  , date_created  : { type: Date  , default: Date.now }
  , isActive      : { type: Boolean, default: false, required: true }
  , friends       : [{ type: ObjectId, ref: 'User'}]
  , isEnterperise : { type:Boolean, default: false, required:true }
})

User.statics.getUsers = function(callback){
  return this.find().sort('_id','descending').limit(15).find({}, callback)
}
//取得指定id用户的所有朋友信息。
User.statics.getFriends = function(userid,callback){
  console.log('in model');
  return this.findById(userid)
             .populate('friends',['username'])
             .run(callback)
}
//检测是否已经在别处登录或者用户名密码是否正确。
User.statics.checkLogin = function(username,password,callback){
  return this.find({username:username,password:password},callback)
}
//检测用户名和email是否已经被注册。
User.statics.checkUnique = function(coname,covalue,callback){
  if(coname=='username')
    return this.find({username:covalue},callback);
  else if(coname=='email')
    return this.find({email:covalue},callback);
}

/**********************************************************/
//测试阶段排错指示……

//保存
User.pre('save', function(next){
  console.log('Saving...');
  next();
});

//删除
User.pre('remove', function(next){
  console.log('removing...');
  next();
});

//中间件——model初始化
User.pre('init', function(next){
  console.log('initializing...');
  next();
});

