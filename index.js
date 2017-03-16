var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var messages = require('./messages');
var bot = require('./bot');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('chat message', function(message) {
  	if (message.useBot) {
  		var botMessage = bot.getMessage(message);
  		socket.emit('bot message', botMessage);
  	} else {
	  	messages.addMessage(message);
	  	socket.broadcast.emit('chat message', message);
  	}
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});