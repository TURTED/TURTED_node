var port = 80;
var http = require('http');
var node_static = require('node-static');
var turted = require('./turted/turted.js');

//some basic url handling
var static_directory = new node_static.Server(__dirname + '/client');
var server = http.createServer();

server.addListener('request', function (req, res) {
    console.log(req.url);
    static_directory.serve(req, res);

});

server.addListener('upgrade', function (req, res) {
    res.end();
});

//instanciate a Core and a SockJs connector
var core = new turted.Core();
var sockjsClientConnector = new turted.SockJsClientConnector(server, core);

console.log(' [*] Listening on 0.0.0.0:' + port);
server.listen(port, '0.0.0.0');
console.log(turted);

//var dispatcher = new YARTED.Dispatcher();
//var dispatch = new YARTED.Dispatch("DISPATCH:DONE",{test:true},{channels: ["chat","log","moves"]});

//console.log(dispatch);
//dispatcher.dispatch(dispatch);
