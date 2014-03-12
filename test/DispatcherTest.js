var Dispatch = require('../models/Dispatch');
var Dispatcher = require('../models/Dispatcher');
var Connection = require('../models/Connection');
var MockSock = require('./mock/MockSock');

var connHandlerMock = {
    resolve: function() {}
}

exports.dispatcherEmitsDispatchedEvent = function (test) {
    var dispatcher = new Dispatcher(connHandlerMock);
    test.expect(1);

    var errTO = setTimeout(function () {
        test.ok(false, "Expected 'testevent' event did not fire");
        test.done();
    }, 50);

    dispatcher.on("testevent", function () {
        clearTimeout(errTO);
        test.ok(true, "Package fired 'testevent' event")
        test.done();
    })
    var d = new Dispatch("testevent",{},{broadcast:true});
    dispatcher.dispatch(d);
}
