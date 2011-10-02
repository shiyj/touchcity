/**
 * Load dependencies
 */

const mongoose = require('mongoose');

require('express-mongoose');  

/**
 * Exports
 */
 
module.exports = function(){
  
  //注册model到mongoose 
  mongoose.model('User', require('../app/models/user'));
  mongoose.model('Weibo',require('../app/models/weibo'));
}
