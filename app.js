var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var data = require('./data');
var weixin = require('./weixin');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'robotcat',
  saveUninitialized: true,
  resave: false,
  store: new redisStore({
    host: 'localhost',
    port: 6379,
    db: 3
  })
}));


// 设置根目录和API目录
// =============================================================================
var routes = require('./routes/index');
var guess = require('./routes/api/guess');
var result = require('./routes/api/result');
var user = require('./routes/api/user');
var weixinAPI = require('./weixin/weixin');
app.use('/', routes);
app.use('/api',guess);
app.use('/api',result);
app.use('/api',user);
weixinAPI(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// 跑批工作
// =============================================================================
data.schedule();
weixin.schedule();




module.exports = app;
