var Connection = require('../models/Connection');
var sockjs = require('sockjs');

var SockJsClientConnector = function (server, connHandler) {
    console.log("Init sock.js server")
    this.connHandler = connHandler;

    // all specifics for the socks.js connection go in here

    var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};
    var sockjs_server = sockjs.createServer(sockjs_opts);
    sockjs_server.on('connection', function (nativeConnection) {
        var conn = new Connection(nativeConnection);

        //bind to "send" event of transparent connection and translate to native
        conn.on("send", function () {
            //console.log("Send data to native conn")
            nativeConnection.write.apply(nativeConnection, arguments);
        });

        //forward native connection events to our own transparent connection
        //nativeConnection.on('data', conn.receive);
        nativeConnection.on('data', function (data) {
            console.log("Native Connection received ", data);
            conn.receive.apply(conn, arguments);
        });

        //register connection in connHandler
        connHandler.addConnection(conn);
    });

    sockjs_server.installHandlers(server, {prefix: '/turted'});
}

module.exports = SockJsClientConnector;