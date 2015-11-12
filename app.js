var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var io = require('socket.io').listen(9000);

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

app.use('/', routes);
app.use('/home', routes);
app.use('/users', users);

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

io.sockets.on("connection", function(socket) {
  console.log('connection!!');

  socket.on("message", function(msg) {
    doMsg(socket, msg);
  });

  socket.on("receiveMsg", function(msgObj) {
    // console.log('receiveMsg: ' + JSON.stringify(msgObj));
    processMsg(socket, msgObj);
  });
});

function doMsg(socket, msg) {
  console.log(JSON.stringify(socket.handshake));
  var addr = socket.handshake.address;

  socket.send('server received message!');
  socket.send(addr + ': ' + msg);

  socket.broadcast.send(addr + ': ' + msg);
}

function processMsg(socket, msgObj) {
  socket.emit("receiveMsg", msgObj.name + ': ' + msgObj.msg);
  socket.broadcast.emit("receiveMsg", msgObj.name + ': ' + msgObj.msg);
}

function httpHandler(request, response) {

}


module.exports = app;
