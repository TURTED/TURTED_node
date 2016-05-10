console.log("------");
var cluster = require('cluster');
var http = require('http');
var MasterCommandBus = require('../models/MasterCommandBus');
var WorkerCommandBus = require('../models/WorkerCommandBus');

var cmdBus;

if (cluster.isMaster) {
    var numWorkers = require('os').cpus().length;

    cmdBus = new MasterCommandBus(cluster);

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
} else {
    cmdBus = new WorkerCommandBus();
    cmdBus.on("CONNECTION", function(data) {
        console.log("Jemand bekam eine Connection");
    });

    http.createServer(function(req, res) {
        res.writeHead(200);
        res.end('process ' + process.pid + ' says hello and dies!');
        cmdBus.send("CONNECTION", {huhu: "haha"});

        //now die after 1 sec
    }).listen(8000);

    setTimeout(process.exit, Math.random() * 60000);
}