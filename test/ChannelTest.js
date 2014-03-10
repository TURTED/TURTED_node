var Connection = require('../models/Connection');
var Channel = require('../models/Channel');

exports.channelRegistersConnections = function (test) {
    test.expect(8);
    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var conn3 = new Connection({});
    var channel1 = new Channel("test1");
    var channel2 = new Channel("test2");

    channel1.join(conn1);
    channel1.join(conn2);
    channel1.join(conn3);
    test.equal(channel1.connections.count(),3,"3 connections added");

    channel1.join(conn1);
    test.equal(channel1.connections.count(),3,"Conn1 only added once");

    channel1.leave(conn1);
    test.equal(channel1.connections.count(),2,"Conn1 removed");
    test.equal(channel1.connections.has(conn2.id),true,"Conn1 removed, 2 still there");
    test.equal(channel1.connections.has(conn3.id),true,"Conn1 removed, 3 still there");

    channel2.join(conn1);
    channel2.join(conn2);

    conn1.close();
    test.equal(channel1.connections.count(),2,"closed conn removed");

    conn2.close();
    conn3.close();
    test.equal(channel1.connections.count(),0,"all closed conn removed");
    test.equal(channel2.connections.count(),0,"all closed conn removed");

    test.done();
}

exports.channelEmitsEmptyWhenLastOneLeaves = function (test) {
    var conn = new Connection({});
    var chann = new Channel("emptyroom");
    test.expect(1);

    var errTO = setTimeout(function () {
        test.ok(false, "Expected 'empty' event did not fire");
        test.done();
    }, 50);

    chann.on("empty", function () {
        clearTimeout(errTO);
        test.ok(true, "Channel fired 'empty' event")
        test.done();
    })

    chann.join(conn);
    chann.leave(conn);
}

exports.channelEmitsEmptyWhenLastOneCloses = function (test) {
    var conn = new Connection({});
    var chann = new Channel("emptyroom");
    test.expect(1);

    var errTO = setTimeout(function () {
        test.ok(false, "Expected 'empty' event did not fire");
        test.done();
    }, 50);

    chann.on("empty", function () {
        clearTimeout(errTO);
        test.ok(true, "Channel fired 'empty' event")
        test.done();
    })

    chann.join(conn);
    conn.close();
}
