var Connection = require('../rted/models/Connection')
var Core = require('../rted/models/Core')

exports.coreRegistersConnections = function (test) {
    test.expect(3);
    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var core = new Core();
    core.addConnection(conn1);
    core.addConnection(conn2);

    test.ok(core.connections.has(conn1.id),"Conn1 got registered");
    test.ok(core.connections.has(conn2.id),"Conn2 got registered");

    core.removeConnection(conn2);
    test.ok(!core.connections.has(conn2.id),"Conn1 got unregistered");

    test.done();
}
