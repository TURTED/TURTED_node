//stupid test if my own mocking class MockSock behaves correctly. Testing the tests, you know...

//MockSock is supposed to mock a SockJs connection

var NativeConnection = require('./mock/MockSock');

//Sockjs behaviour
exports.emitsReceiveEvent = function (test) {
    test.expect(1);
    var natConn = new NativeConnection();

    var errTO = setTimeout(function() {
        test.ok(false,"Expected 'receive' event did not fire");
        test.done();
    },50);

    natConn.on("receive",function() {
        clearTimeout(errTO);
        test.ok(true,"Sending data fired 'receive' event")
        test.done();
    })
    natConn.data({asdf:"asdf"});
};

//Sockjs behaviour
exports.emitsCloseEvent = function (test) {
    test.expect(1);
    var natConn = new NativeConnection();

    var errTO = setTimeout(function() {
        test.ok(false,"Expected 'close' event did not fire");
        test.done();
    },50);

    natConn.on("close",function() {
        clearTimeout(errTO);
        test.ok(true,"calling close fires 'close' event")
        test.done();
    })
    natConn.close();
};

exports.emitDisconnectionEvent = function (test) {
    test.expect(1);
    var natConn = new NativeConnection();

    var errTO = setTimeout(function() {
        test.ok(false,"Expected 'connection' event did not fire");
        test.done();
    },50);

    natConn.on("disconnect",function() {
        clearTimeout(errTO);
        test.ok(true,"calling disconnect fires 'disconnect' event")
        test.done();
    })
    
    natConn.disconnect();
};
