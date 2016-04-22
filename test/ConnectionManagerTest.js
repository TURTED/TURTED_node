var Connection = require('../models/Connection');
var UserManager = require('../models/UserManager');
var ChannelManager = require('../models/ChannelManager');
var ConnectionManager = require('../models/ConnectionManager');
var Dispatch = require('../models/Dispatch');

exports.connManRegistersConnections = function(test) {
    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var connManager = new ConnectionManager();
    connManager.addConnection(conn1);
    connManager.addConnection(conn2);

    test.ok(connManager.connections.has(conn1.id), "Conn1 got registered");
    test.ok(connManager.connections.has(conn2.id), "Conn2 got registered");

    conn1.close();
    //connMan.removeConnection(conn2);
    test.equal(connManager.connections.has(conn1.id), false, "Conn1 got unregistered");

    test.done();
}

exports.connManReturnsAllConnections = function(test) {
    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var connManager = new ConnectionManager();
    connManager.addConnection(conn1);
    connManager.addConnection(conn2);

    test.equal((conn1.id in connManager.getConnections()), true, "Conn1 got registered");
    conn1.close();
    test.equal((conn1.id in connManager.getConnections()), false, "Conn1 got unregistered");

    test.done();
};

exports.resolve = function(test) {
    test.expect(13);

    var auth = {
        verify: function() {
            return true
        }
    };

    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var conn3 = new Connection({});
    var conn4 = new Connection({});
    var conn5 = new Connection({});
    var conn6 = new Connection({});
    var conn7 = new Connection({});
    var conn8 = new Connection({});
    var conn9 = new Connection({});
    var conn10 = new Connection({});

    var userMan = new UserManager();
    var chanMan = new ChannelManager();
    var connMan = new ConnectionManager({
        usermanager: userMan,
        channelmanager: chanMan,
        authenticator: auth
    });

    connMan.addConnection(conn1);

    var d;
    var expectation;
    d = new Dispatch("test", "data", {broadcast: true});
    connMan.resolve(d);
    expectation = {};
    expectation[conn1.id] = conn1;
    test.deepEqual(d.getTargetConnections(), expectation, "Broadcast includes all");
    conn1.close();

    connMan.addConnection(conn2);
    chanMan.handleJoin("test1", conn2);
    d = new Dispatch("test", "data", {channels: ["test1"]});
    connMan.resolve(d);
    expectation = {};
    expectation[conn2.id] = conn2;
    test.deepEqual(d.getTargetConnections(), expectation, "Includes all of channel test1");
    conn2.close();

    connMan.addConnection(conn3);
    chanMan.handleJoin("test1", conn3);
    d = new Dispatch("test", "data", {channels: ["test1"]});
    connMan.resolve(d);
    expectation = {};
    expectation[conn3.id] = conn3;
    test.deepEqual(d.getTargetConnections(), expectation, "Resolve of channel test1");
    conn3.close();
    conn4.close();

    chanMan.handleJoin("test1", conn5);
    chanMan.handleJoin("test1", conn6);
    userMan.addUserConnection("asdf", conn6);

    chanMan.handleJoin("another", conn7);
    userMan.addUserConnection("another", conn8);

    d = new Dispatch("test", "data", {channels: ["test1"], users: ["asdf"]});
    connMan.resolve(d);
    expectation = {};
    expectation[conn5.id] = conn5;
    expectation[conn6.id] = conn6;
    test.deepEqual(d.getTargetConnections(), expectation);

    userMan.addUserConnection("asdf", conn9);
    connMan.resolve(d);

    var num = 0;
    for (var i in d.getTargetConnections()) {
        num++;
    }
    test.equal(num, 3, "returns 3 targets");
    test.equal(d.getTargetConnections().hasOwnProperty(conn5.id), true, "5 is in");
    test.equal(d.getTargetConnections().hasOwnProperty(conn6.id), true, "6 is in");
    test.equal(d.getTargetConnections().hasOwnProperty(conn9.id), true, "9 is in");

    userMan.addUserConnection("second", conn10);

    d = new Dispatch("test", "data", {channels: ["test1"], users: ["asdf", "second"]});
    connMan.resolve(d);

    var num = 0;
    for (var i in d.getTargetConnections()) {
        num++;
    }
    test.equal(num, 4, "returns 4 targets");
    test.equal(d.getTargetConnections().hasOwnProperty(conn5.id), true, "5 is in");
    test.equal(d.getTargetConnections().hasOwnProperty(conn6.id), true, "6 is in");
    test.equal(d.getTargetConnections().hasOwnProperty(conn9.id), true, "9 is in");
    test.equal(d.getTargetConnections().hasOwnProperty(conn10.id), true, "10 is in");

    test.done();
};
