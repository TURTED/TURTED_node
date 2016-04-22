//stupid test if my own mocking class behaves correctly. Testing the tests, you know...

//MockServ is supposed to mock a Socket Server

var NativeServer = require('./mock/MockServ');
var NativeConnection = require('./mock/MockSock');

exports.emitConnectionEvent = function(test) {
    test.expect(2);
    var natServ = new NativeServer();
    var natConn = new NativeConnection();

    var errTO = setTimeout(function() {
        test.ok(false, "Expected 'connection' event did not fire");
        test.done();
    }, 50);

    natServ.on("connection", function(con) {
        clearTimeout(errTO);
        test.deepEqual(con, natConn, "native connection was passed");
        test.ok(true, "Server can moock a new native connection event");
        test.done();
    });

    natServ.nativeConnect(natConn);
};
