var port = 80;
var http = require('http');
var node_static = require('node-static');
var turted = require('./turted/turted.js');

var config = require('./turted/config.js');

//some basic url handling
var static_directory = new node_static.Server(__dirname + '/client');
var server = http.createServer();

//instanciate an authenticator for checking incoming identification requests
//var auth = new turted.TokenAuthenticator(config.authTokenPrefix, config.authTokenSuffix, config.authTokenHashType);
var auth = new turted.AlwaysAcceptAuthenticator();

var connMan = new turted.ConnectionManager();
var userMan = new turted.UserManager(auth);
var chanMan = new turted.ChannelManager();

//instanciate a central connection handler, Dispatcher and a SockJs connector
var connHandler = new turted.ConnectionHandler(connMan, userMan, chanMan);
var dispatcher = new turted.Dispatcher(connHandler);

//init push connector
var pushPrefix = "/push/?";
var pushAuthToken = "IamAllowed2PUSH!!!";
var pushRegExp = new RegExp(pushPrefix);
var pusher = new turted.ApeInlinePushConnector(dispatcher, pushPrefix, pushAuthToken);

server.addListener('request', function (req, res) {
    if (pushRegExp.test(req.url)) {
        pusher.push(req,res);
    } else {
        static_directory.serve(req, res);
    }
});

server.addListener('upgrade', function (req, res) {
    res.end();
});

//now instanciate sock js
var sockjsClientConnector = new turted.SockJsClientConnector(server, connHandler);

console.log(' [*] Listening on 0.0.0.0:' + port);
server.listen(port, '0.0.0.0');

