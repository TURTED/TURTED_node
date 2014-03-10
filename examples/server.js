var port = 80;
var http = require('http');

var turted = require('turted');
var config = require('config.js');

//some basic url handling
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
        res.end()
    }
});

server.addListener('upgrade', function (req, res) {
    res.end();
});

//now instanciate sock js
var sockjsClientConnector = new turted.SockJsClientConnector(server, connHandler);

console.log(' [*] Listening on 0.0.0.0:' + port);
server.listen(port, '0.0.0.0');
