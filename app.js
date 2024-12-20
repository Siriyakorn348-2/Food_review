var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var path = require("path");
var ejs = require("ejs");
var sessions = require("express-session");


var indexRouter = require('./routes/index');
var profileRouter = require('./routes/profile');
var postRouter = require('./routes/post');

var app = express();

const dbURI = 'mongodb://127.0.0.1:27017/myproject';

mongoose.connect(dbURI)
  .then((result)=> console.log('Connected'))
  .catch((err) => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '1mb', type: 'application/json' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/', indexRouter);
app.use('/profile', profileRouter);
app.use('/posts', postRouter);

app.use(express.static("public"));
app.use(
  sessions({
    secret: "secret key",
    saveUninitialized: true,
    resave: false,
  })
);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
