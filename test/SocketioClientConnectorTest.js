var Connection = require('../models/Connection');
var MockSock = require('./mock/MockSock');
var MockServ = require('./mock/MockServ');
var MockConnectionManager = require('./mock/MockConnectionManager');
var SocketioClientConnector = require('../connectors/SocketioClientConnector');

exports.encapsulatesNativeDisconnectToCLOSE = function(test) {

    var natCon = new MockSock();
    var connMan = new MockConnectionManager();
    var socketserver = new MockServ();
    var scc = new SocketioClientConnector(socketserver, connMan);

    test.expect(1);
    socketserver.nativeConnect(natCon);
    //test.ok(connMan.lastConnection, "connMan got the connection");
    var conn = connMan.lastConnection;

    var errTO = setTimeout(function() {
        test.ok(false, "Expected 'CLOSE' event did not fire");
        test.done();
    }, 100);

    conn.on("CLOSE", function() {
        clearTimeout(errTO);
        test.ok(true, "Native disconnect fires Connection 'CLOSE' event")
        test.done();
    });
    natCon.disconnect();
};
