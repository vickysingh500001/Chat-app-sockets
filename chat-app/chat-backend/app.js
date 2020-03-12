var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socket = require('socket.io');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

// var server = require('http').createServer(app);

var cors = require('cors');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({credentials: false, origin: '*'}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
server = app.listen(8080, function(){
  console.log('server is running on port 8080')
});
var io = socket(server); 
io.on('connection',(socket) => {
  console.log('socket',socket.id);
  socket.on('SEND_MESSAGE',(data)=>{
    io.emit('RECIEVE_MESSAGE',data)
  })
})
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
