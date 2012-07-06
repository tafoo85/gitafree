var express = require('express'),
	app = express.createServer(), //create the express web server
	io = require('socket.io').listen(app), //create the socket.io closure and listen at the app
	crypto = require('crypto');

console.log('Listening for requests on port 80');
app.listen(80); //listen for connections on port 80

app.configure(function() { 
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions: true, 
		showStack: true
	}));
});

socket = io.on('connection', function(socket) {
	socket.on('KEY_REQUEST', function(data) {
		var sha256 = crypto.createHash('sha256');
		
		sha256.update(Date.now().toString());
		socket.emit('KEY_READY', { payload: { key: sha256.digest('base64') } })
	});
	
	socket.on('FILE_REQUEST', function(data) {
		
	});
	
	return socket;
});

app.put('/upload/:key', function(req, res) {
	if (req.params.id === '') {
		console.log('Invalid key');
		res.send('Invalid Request Key', 400);
	}
});

