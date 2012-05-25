var express = require('express'),
	app = express.createServer(), //create the express web server
	io = require('socket.io').listen(app); //create the socket.io closure and listen at the app

console.log('Listening for requests on port 80');
app.listen(80); //listen for connections on port 80

app.configure(function() { 
	app.use(app.router);
	app.use(express.bodyParser());
	app.use(express.methodOverride());
});

app.configure('development', function() {
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({
		dumpExceptions: true, 
		showStack: true
	}));
})

app.get('/', function(req, res) {
	console.log('Request for / being processed');
	res.sendfile('index.html');
});
