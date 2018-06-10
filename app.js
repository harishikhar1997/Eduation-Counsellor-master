var express=require("express"),
	socketIO=require('socket.io'),
	apiai=require("apiai"),
	http=require('http'),
	app=express();
	server=http.createServer(app),
	io=socketIO(server),

app.use(express.static('Public'));
app.set('view engine','ejs');

var api=apiai("fc37b7698854469caa1f6b5c6c40aa66");

var request = api.textRequest('Machine Learning', {
    sessionId: '2363219a42fb448e828d114aedeacdd5'
});

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();

app.get("/",function(req,res)
{
	res.render('landing');
});

app.get("/chat",function(req,res)
{
	res.render('chat-page');
});

io.on('connection',function(socket){
	console.log("user connected.");

	socket.emit('welcome',{from:'Admin',text:'Welcome to the Chat room.'});
	socket.broadcast.emit('welcome',{
			from:'Admin',
			text:'New User Connected.'
			// time:new Date().getTime()
		});
	socket.on('createMessage',function(message,callback){
		socket.broadcast.emit('newMessage',{
			from:message.to,
			message:message.message,
			time:new Date().getTime()
		});
		callback('Message Sent.');
	});

	socket.on('disconnect',function(){
			console.log("Connection Disconnected");
		});
	socket.on('sendlocation',function(location,callback){
		socket.broadcast.emit('sendlocation',{
			link:`http://www.google.com/maps?q=${location.latitude},${location.longitude}`
		})
		callback("Location Sent");
	});
});
server.listen(3000,function() {
	console.log("Messenger Online....");
});
