const Schema = require('mongoose').Schema
    , ObjectId = Schema.ObjectId;

var User = module.exports = new Schema({
    username         : { type: String, required: true }
  , password          : { type: String, required: true }
  , email     : { type: String,required: true }
  , date_created  : { type: Date, default: Date.now }
  , date_updated  : { type: Date } 
})

User.statics.getUsers = function(callback){
  return this.find().sort('_id','descending').limit(15).find({}, callback)
}

//this happens before it saves, they are called middleware

User.pre('save', function(next){
  console.log('Saving...');
  next();
});

//this happens before it removes, they are called middleware

User.pre('remove', function(next){
  console.log('removing...');
  next();
});

//this happens when it inititializes, they are called middleware

User.pre('init', function(next){
  console.log('initializing...');
  next();
});

