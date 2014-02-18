var MockSock = require('../mock/MockSock');
var Connection = require('../turted/models/Connection')
var ConnectionManager = require('../turted/models/ConnectionManager')

exports.connManRegistersConnections = function (test) {
    test.expect(3);
    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var connMan = new ConnectionManager();
    connMan.addConnection(conn1);
    connMan.addConnection(conn2);

    test.ok(connMan.connections.has(conn1.id),"Conn1 got registered");
    test.ok(connMan.connections.has(conn2.id),"Conn2 got registered");

    connMan.removeConnection(conn2);
    test.ok(!connMan.connections.has(conn2.id),"Conn1 got unregistered");

    test.done();
}

exports.connManStoresUser = function(test) {
    var nativeConn = new MockSock();
    var conn1 = new Connection({});

}
