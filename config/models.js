/**
 * Load dependencies
 */

const mongoose = require('mongoose');

require('express-mongoose');  

/**
 * Exports
 */
 
module.exports = function(){
  
  //  Load Blog Post model
  
  mongoose.model('User', require('../app/models/user'));

}
