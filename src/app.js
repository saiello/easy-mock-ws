
/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var mock = require('./services/mock.js');

var app = express();

// all environments
app.set('mock_path', process.env.MOCK_PATH);
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.use(function(req, res, next) {
  req.rawBody = '';
  req.setEncoding('utf8');

  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });

  req.on('end', function() {
    next();
  });
});


mock.init(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
