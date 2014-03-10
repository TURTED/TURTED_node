var RawData = require('../models/RawData');
var Connection = require('../models/Connection');
var ConnectionManager = require('../models/ConnectionManager');

exports.connManRegistersConnections = function (test) {
    test.expect(3);
    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var connManager = new ConnectionManager();
    connManager.addConnection(conn1);
    connManager.addConnection(conn2);

    test.ok(connManager.connections.has(conn1.id),"Conn1 got registered");
    test.ok(connManager.connections.has(conn2.id),"Conn2 got registered");

    conn1.close();
    //connMan.removeConnection(conn2);
    test.equal(connManager.connections.has(conn1.id),false,"Conn1 got unregistered");

    test.done();
}

exports.connManReturnsAllConnections= function (test) {
    test.expect(2);
    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var connManager = new ConnectionManager();
    connManager.addConnection(conn1);
    connManager.addConnection(conn2);

    test.equal((conn1.id in connManager.getConnections()),true,"Conn1 got registered");
    conn1.close();
    test.equal((conn1.id in connManager.getConnections()),false,"Conn1 got unregistered");

    test.done();
}

