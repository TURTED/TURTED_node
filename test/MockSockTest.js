//stupid test if my own mocking class MockSock behaves corretly. Testing the tests, you know...


//MockSock is supposed to mock a SockJs connection

var NativeConnection = require('./mock/MockSock');

exports.emitsReceiveEvent = function (test) {
    test.expect(1);
    var natConn = new NativeConnection();

    var errTO = setTimeout(function() {
        test.ok(false,"Expected 'receive' event did not fire");
        test.done();
    },100);

    natConn.on("receive",function() {
        clearTimeout(errTO);
        test.ok(true,"Sending data fired 'receive' event")
        test.done();
    })
    natConn.data({asdf:"asdf"});
};

exports.emitsCloseEvent = function (test) {
    test.expect(1);
    var natConn = new NativeConnection();

    var errTO = setTimeout(function() {
        test.ok(false,"Expected 'close' event did not fire");
        test.done();
    },100);

    natConn.on("close",function() {
        clearTimeout(errTO);
        test.ok(true,"Sending data fired 'close' event")
        test.done();
    })
    natConn.close();
};

