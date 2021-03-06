
/**
 * Module dependencies.
 */

domain = 'netowork.me:4321'
Prelude = require('prelude-ls');
var sqlite = require('sqlite3').verbose()
  , models = require('./routes/models');
orm = require('orm');
orm.connect('sqlite://db1.sqlite', models.models);
var http = require('http');

var express = require('express')
  , frontend = require('./routes/frontend')
  , http = require('http')
  , path = require('path');

var app = express();
var partials = require('express-partials');

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);

  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
//app.use(partials());

var handlers = frontend.init(models);

app.get('/', handlers.recent);
app.get('/editor', handlers.editor);
app.get('/letter/:name', handlers.formname);
app.get('/create-form', handlers.createform);
app.post('/search/letters/tags', handlers.searchLetters);
app.get('/search/letters/tags', handlers.searchLetters);
app.post('/search/tags/name', handlers.searchTags);
app.get('/search/tags/name', handlers.searchTags);
app.post('/create-form/submit', handlers.submitform);
app.post('/render', handlers.renderHtml);
app.get('/render_res', handlers.getResult);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
