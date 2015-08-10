var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser')
var io;


var app = require('express')();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/statics'));
app.use(session({secret:'nodejs-site'}));
app.get('/', require('./routes/index'));
app.get('*', function(request,response) {
    response.redirect('/');
});

var http = require('http').Server(app);
io = require('socket.io')(http);
require('./websockets/main')(io);

var drumsplaying = false;
var socket_count = 0;
var socket_ids = [];


var port = 80;
http.listen(port, function(){
  console.log('listening on *:'+port);
});





















