var Connection = require('../models/Connection');
var User = require('../models/User');

exports.userRegistersConnections = function(test) {
    test.expect(8);
    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var conn3 = new Connection({});
    var user1 = new User("test1");
    var user2 = new User("test2");

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

    user2.add(conn1);
    user2.add(conn2);

    conn1.close();
    test.equal(user1.connections.count(), 2, "closed conn removed");

    conn2.close();
    conn3.close();
    console.log(user1.connections.count());
    test.equal(user1.connections.count(), 0, "all closed conn removed");
    test.equal(user2.connections.count(), 0, "all closed conn removed");

    test.done();
};
