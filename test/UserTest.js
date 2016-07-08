var Connection = require('../models/Connection');
var User = require('../models/User');

exports.userRegistersConnections = function(test) {
    test.expect(5);
    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var conn3 = new Connection({});
    var user1 = new User("test1");

    user1.add(conn1);
    user1.add(conn2);
    user1.add(conn3);
    test.equal(user1.connections.count(), 3, "3 connections added");

    user1.add(conn1);
    test.equal(user1.connections.count(), 3, "Conn1 only added once");

    user1.remove(conn1);
    test.equal(user1.connections.count(), 2, "Conn1 removed");
    test.equal(user1.connections.has(conn2.id), true, "Conn1 removed, 2 still there");
    test.equal(user1.connections.has(conn3.id), true, "Conn1 removed, 3 still there");

    /* user does not listen to CLOSE of connections, needs to be done by usermanager */
    test.done();
};
