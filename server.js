var port = 80;
var http = require('http');
var node_static = require('node-static');
var turted = require('./turted/turted.js');

//some basic url handling
var static_directory = new node_static.Server(__dirname + '/client');
var server = http.createServer();

//instanciate an authenticator for checking incoming identification requests
var authTokenPrefix = "qwer";
var authTokenSuffix = "asdf";
var auth = new turted.TokenAuthenticator(authTokenPrefix, authTokenSuffix, "md5");

//instanciate a Dispatcher and a SockJs connector
var connMan = new turted.ConnectionManager(auth);
var dispatcher = new turted.Dispatcher(connMan);

//init push connector
var pushPrefix = "/push/?";
var pushAuthToken = "IamAllowed2PUSH!!!";
var pushRegExp = new RegExp(pushPrefix);
var pusher = new turted.ApeInlinePushConnector(dispatcher, pushPrefix, pushAuthToken);

server.addListener('request', function (req, res) {
    if (pushRegExp.test(req.url)) {
        pusher.push(req);
    } else {
        static_directory.serve(req, res);
    }
});

server.addListener('upgrade', function (req, res) {
    res.end();
});

//now instanciate sock js
var sockjsClientConnector = new turted.SockJsClientConnector(server, connMan);

console.log(' [*] Listening on 0.0.0.0:' + port);
server.listen(port, '0.0.0.0');

//var dispatcher = new YARTED.Dispatcher();
//var dispatch = new YARTED.Dispatch("DISPATCH:DONE",{test:true},{channels: ["chat","log","moves"]});

//console.log(dispatch);
//dispatcher.dispatch(dispatch);
