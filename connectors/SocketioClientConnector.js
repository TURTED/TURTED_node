var logger = require("../models/Logger");
var Connection = require('../models/Connection');

var SockJsClientConnector = function(socketServer, connManager) {
    logger.debug("Init socket.io server")
    this.connManager = connManager;

    // all specifics for the socks.js connection go in here

    socketServer.on('connection', function(nativeConnection) {
        var conn = new Connection(nativeConnection);

        logger.debug("Got a connection", conn.id);

        //forward native connection events to our own transparent connection
        //nativeConnection.on('data', conn.receive);
        nativeConnection.on('IDENT', function(data) {
            console.log("Da kam ein ident", data)
            conn.receive.call(conn, "IDENT", data);
        });
        nativeConnection.on('JOIN', function(data) {
            logger.debug("Native join received join ", data);
            conn.receive.call(conn, "JOIN", data);
        });
        nativeConnection.on('message', function(data) {
            logger.debug("Native Connection received ", data);
            conn.receive.call(conn, data);
        });

        nativeConnection.on('PING', function(data) {
            logger.debug("Native Connection received ", data);
            conn.receive.call(conn, "PING", data);
        });

        nativeConnection.on('ECHO', function(data) {
            logger.debug("Native Connection received ", data);
            conn.receive.call(conn, "ECHO", data);
        });

        nativeConnection.on("disconnect", function(data) {
            logger.debug("Native Connection disconnect -> CLOSE")
            conn.receive.call(conn, "CLOSE", data);
        });

        //set adequate "send" function here that translates to native
        conn.send = function() {
            logger.debug("Send data to native conn");
            console.log(arguments);
            nativeConnection.emit.apply(nativeConnection, arguments);
        };

        //register connection in connManager
        connManager.addConnection(conn);
    });
}

module.exports = SockJsClientConnector;