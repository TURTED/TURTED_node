//define the port on which your server will be listening
var port = 7117;

var http = require('http');
var _ = require("lodash-node");
var io = require('socket.io');
var turted = require('../turted.js');
var config = require('./config.js');

//create a basic server
var server = http.createServer();

//instanciate an authenticator for checking incoming identification requests
//var auth = new turted.TokenAuthenticator(config.authTokenPrefix, config.authTokenSuffix, config.authTokenHashType);
var auth = new turted.AlwaysAcceptAuthenticator();
var userMan = new turted.UserManager();
var chanMan = new turted.ChannelManager();

//instantiate the central connection manager
//with an optional usermanager (to be able to address users with their username)
//and an optional channel manager (to send messages to certain channels)
// You can drop any of it, so direct push to user and/or join/leave events will be ignored
var connMan = new turted.ConnectionManager({
    usermanager: userMan,
    channelmanager: chanMan
});

//Dispatcher is the class responsible for accepting external events to push
var dispatcher = new turted.Dispatcher(connMan);

//init push connector
//The push connector is the "outside facing" interface to accept connections with push events to forward to users or channels
var pushPrefix = "/push/";
var pushAuthPassword = "IamAllowed2PUSH!!!";
var pushRegExp = new RegExp(pushPrefix);
var pushAuthenticator = new turted.PasswordAuthenticator(pushAuthPassword);

var pushConnector = new turted.RestPushConnector(dispatcher, pushPrefix, pushAuthenticator);

server.addListener('request', function(req, res) {
    //if the url contains the "pushPrefix" (/push/), we let the pushConnector handle it
    if (pushRegExp.test(req.url)) {
        pushConnector.push(req, res);
    } else {
        res.end()
    }
});

//now instanciate socket
var socketserver = new io(server);
var socketioClientConnector = new turted.SocketioClientConnector(socketserver, connMan);

console.log(' [*] Listening on 0.0.0.0:' + port);
server.listen(port, '0.0.0.0');

setInterval(connectionInfo, 15000);
setInterval(userInfo, 15000);
setInterval(channelInfo, 15000);

setTimeout(connectionInfo, 5000)
setTimeout(userInfo, 5000);
setTimeout(channelInfo, 5000);

function connectionInfo() {
    console.log("------------Connections--------------------");
    console.log("Count: ", connMan.connections.length());
}

function userInfo() {
    console.log("-----------------Users---------------------");
    _.each(userMan.users.getItems(), function(e, key) {
        var n = _.keys(e._items).join(",");
        console.log("*", key, n);
    });
}

function channelInfo() {
    console.log("-----------------Channels------------------");
    _.each(chanMan.channels.getItems(), function(channel, name) {
        var n = channel.connections.length();
        console.log("*", name, ": ", n);
    });
}
