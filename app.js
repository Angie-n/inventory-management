var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

const mongoose = require('mongoose');

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const compression = require("compression");
const helmet = require("helmet");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression());
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'", "https://kit.fontawesome.com/", "https://code.jquery.com", "https://ka-f.fontawesome.com/"],
        "connect-src": ["'self'", "https://kit.fontawesome.com/", "https://code.jquery.com", "https://ka-f.fontawesome.com/"],
        "script-src": ["'self'", "https://kit.fontawesome.com/", "https://code.jquery.com", "https://ka-f.fontawesome.com/"],
        "img-src": ["'self'", "https://raw.githubusercontent.com/PokeAPI/"]
      }},
  })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

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
  if(err.status === 404) res.render('not_found');
  res.render('error');
});

module.exports = app;
