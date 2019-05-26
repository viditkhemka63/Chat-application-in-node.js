var createError = require('http-errors');
var express = require('express');
var socket_io    = require( "socket.io" );

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var cors = require('cors');
var session  = require('express-session');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatRouter = require('./routes/chat');
var roomRouter = require('./routes/room');

var app = express();

var io = socket_io();
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Database connection
var DBUrl = 'mongodb://root:admin123@ds117251.mlab.com:17251/teletype';
mongoose.connect(DBUrl, { useNewUrlParser: true  }, (err) => {
  if(err) return err;

  console.log('database connected');
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// initialized Passport
require('./config/passport');
app.use(session({
  secret: 'Token',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// adding routes
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/chats', chatRouter);
app.use('/', roomRouter);

var Chat = require('./model/chat');

io.on('connection', (socket) => {
    console.log('User connected to socket id '+ socket.id);

    socket.on('chat',(data) =>{
      io.sockets.emit('chat',data);
      console.log('after emit function');

      var chat = new Chat({
        sender: data.handle,
        message: data.message,
        roomId: data.roomId
      });
      chat.save((err, doc) => {
        if(err) throw err;
        console.log(doc);
      });
  });

  socket.on('typing',(data) =>{
      socket.broadcast.emit('typing',data)
  })
});

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
