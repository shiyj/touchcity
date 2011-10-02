/**
 *  Load dependencies
 */

const express   = require('express')
    , mongoose  = require('mongoose')

/**
 *  Exports
 */

module.exports = function(app){

  //  Setup DB Connection

  var dblink = process.env.MONGOHQ_URL || 'mongodb://localhost/engintest';

  const db  = mongoose.createConnection(dblink);

  //  Configure expressjs

  app.configure(function (){
    this
      .use(express.logger('\033[90m:method\033[0m \033[36m:url\033[0m \033[90m:response-time ms\033[0m'))
      .use(express.cookieParser())
      .use(express.bodyParser())
      .use(express.errorHandler({dumpException: true, showStack: true}))
      .use(express.session({ secret: 'shiyj@#zzu$&gis'}))
  });

  //  Add template engine

  app.configure(function(){
    this
      .set('views', __dirname + '/../app/views')
      .set('view engine', 'ejs')
      .use(express.static(__dirname + '/../public'))
  });

  //  Save reference to database connection
  // 'users': db.model('User')是在db中引用时将User映射为users。 
  app.configure(function () {
    app.set('db', { 
        'main': db
      , 'users': db.model('User')
      , 'weibo': db.model('Weibo')
    })
    app.set('version', '0.1.4');
	app.set('host','localhost')
  });
   
  
  return app;
}
