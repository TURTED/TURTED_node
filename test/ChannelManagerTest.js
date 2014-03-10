var RawData = require('../models/RawData');
var Connection = require('../models/Connection');
var ChannelManager = require('../models/ChannelManager');

function objLen (obj) {
    var i=0;
    for (var k in obj) {
        i++;
    }
    return i;
}

exports.chanManRegistersConnections = function (test) {
    test.expect(10);
    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var conn3 = new Connection({});
    var chanManager = new ChannelManager();

    chanManager.handleJoin(conn1, {channel: "test1"});
    chanManager.handleJoin(conn2, {channel: "test1"});
    chanManager.handleJoin(conn3, {channel: "test1"});
    test.equal(chanManager.channels.has("test1"),true,"Chanman created a channel");
    test.equal(chanManager.channels.count(),1,"Chanman created one channel");

    chanManager.handleJoin(conn1, {channel: "test1"});
    chanManager.handleJoin(conn1, {channel: "test1"});
    test.equal(chanManager.channels.count(),1,"Chanman created one channel");

    chanManager.handleJoin(conn1, {channel: "test2"});
    chanManager.handleJoin(conn1, {channel: "test3"});
    test.equal(chanManager.channels.has("test2"),true,"Chanman created more channels");
    test.equal(chanManager.channels.count(),3,"Chanman created three channels");

    chanManager.handleJoin(conn1, {channel: ""});
    test.equal(chanManager.channels.count(),3,"Chanman did not create a channel with invalid name");

    chanManager.handleJoin(conn1, {tchannel: "asdf"});
    test.equal(chanManager.channels.count(),3,"Chanman did not break when channel name was missing");

    chanManager.handleLeave(conn1, {channel: "test2"});
    test.equal(chanManager.channels.count(),2,"Chanman closed channel 2 after only connection left");
    conn1.close();
    test.equal(chanManager.channels.count(),1,"Chanman closed channels 2 and 3 after only connection closed");

    conn2.close();
    conn3.close();
    test.equal(chanManager.channels.count(),0,"Chanman closed all channels after all connections left");
    //connMan.removeConnection(conn2);

    test.done();
}

exports.chanManReturnsConnections = function (test) {
    test.expect(2);
    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var conn3 = new Connection({});
    var chanManager = new ChannelManager();

    chanManager.handleJoin(conn1, {channel: "test1"});
    chanManager.handleJoin(conn2, {channel: "test1"});
    chanManager.handleJoin(conn3, {channel: "test1"});
    chanManager.handleJoin(conn1, {channel: "test1"});
    chanManager.handleJoin(conn1, {channel: "test1"});
    chanManager.handleJoin(conn1, {channel: "test2"});
    chanManager.handleJoin(conn1, {channel: "test3"});

    test.equal(objLen(chanManager.getChannelConnections("test1")),3); //,"Returns the 3 conns on channel test1")
    test.equal((conn1.id in chanManager.getChannelConnections("test3")),true,"Returns conn1 as part of channel test3")
    test.done();
}
