const Schema = require('mongoose').Schema
    , ObjectId = Schema.ObjectId;

var Weibo = module.exports= new Schema({
    userid        : { type: ObjectId, required: true }
  , msg           : { type: String  , required: true }
  , created_at    : { type: Date    , default: Date.now }
  , isFather      : { type: Boolean , default: false, required: true}
  , father        : [{type: ObjectId, ref: 'Weibo'}]
  , comments      : [{type: ObjectId, ref: 'Weibo'}]
})

Weibo.statics.getMyWibo = function(userid,callback){
  return this.find().sort({'create_at':-1}).limit(100).find({userid:userid,isFather:true},callback);
}

Weibo.statics.getMyComments = function(userid,callback){
  return this.find().sort({'create_at':-1}).limit(100).find({userid:userid,isFather:false},callback);
}

