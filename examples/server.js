//define the port on which your server will be listening
var port = 7117;

var cluster = require('cluster');
var http = require('http');
var _ = require("lodash-node");
var io = require('socket.io');
var turted = require('../turted.js');
var config = require('./config.js');
var MasterCommandBus = require('../models/MasterCommandBus');
var WorkerCommandBus = require('../models/WorkerCommandBus');
var MasterDataCollector = require('../models/MasterDataCollector');
var WorkerDataCollector = require('../models/WorkerDataCollector');
var cmdBus;
var dataCollector;

//master only deals with setting up nodes and keeping them alive
if (cluster.isMaster) {
    var numWorkers = require('os').cpus().length;
    var connectionCounters = [];
    var userCounters = [];

    cmdBus = new MasterCommandBus(cluster);
    dataCollector = new MasterDataCollector(cluster);

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        var w = cluster.fork();
    });

    //one worker per CPU
    for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    setInterval(showData, 5000);
    function showData() {
        userCounters = [];
        connectionCounters = [];
        var totU = 0;
        var totC = 0;
        for (var wid in dataCollector.data) {
            var uc = dataCollector.data[wid].userCounter;
            var cc = dataCollector.data[wid].connectionCounter;
            userCounters.push(uc);
            totU += uc;
            connectionCounters.push(cc);
            totC += cc;
        }
        console.log("----Users and Connections ---")
        console.log("Users:       (" + userCounters.join("|") + ") = " + totU);
        console.log("Connections: (" + connectionCounters.join("|") + ") = " + totC);
    }
} else {
    cmdBus = new WorkerCommandBus();
    cmdBus.on("CONNECTION", function(data) {
        console.log("Jemand bekam eine Connection");
    });

    dataCollector = new WorkerDataCollector();

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

    cmdBus.on("DISPATCH", function(data) {
        dispatcher.dispatchEventDataTarget(data.event, data.payload, data.targets)
    });

    //init push connector
    //The push connector is the "outside facing" interface to accept connections with push events to forward to users or channels
    var pushPrefix = "/push/";
    var pushAuthToken = "IamAllowed2PUSH!!!";
    var pushRegExp = new RegExp(pushPrefix);

    //var pushConnector = new turted.ApeInlinePushConnector(dispatcher, pushPrefix, pushAuthToken);
    var pushConnector = new turted.RestPushConnector(cmdBus, pushPrefix, pushAuthToken);

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

    setInterval(function() {
        dataCollector.set("userCounter", userMan.users.length());
        dataCollector.set("connectionCounter", connMan.connections.length());
    }, 5000);


    //sudden death
    /*
    setInterval(function() {
        process.exit();
    }, Math.random() * 20000);
    */
}
