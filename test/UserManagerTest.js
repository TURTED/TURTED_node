var Connection = require('../models/Connection')
var UserManager = require('../models/UserManager');

function objLen (obj) {
    var i=0;
    for (var k in obj) {
        i++;
    }
    return i;
}

exports.returnsAllUsersConnections = function(test) {
    test.expect(6);

    //mock an authenticator that always accepts
    var auth = {};
    auth.verify = function () {
        return true;
    }

    var userMan = new UserManager(auth);
    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var conn3 = new Connection({});
    userMan.addUserConnection("asdf", conn1);
    userMan.addUserConnection("asdf", conn2);
    userMan.addUserConnection("qwer", conn3);

    test.equal(objLen(userMan.getUserConnections("asdf")),2,"Returns 2 for asdf");
    test.equal(objLen(userMan.getUserConnections("qwer")),1,"Returns 1 for qwer");
    test.deepEqual(userMan.getUserConnections("none"),{},"Returns 0 for non-existant");
    conn3.close();
    test.deepEqual(userMan.users.has("qwer"),false,"User is unregistered if his last connection left");
    test.deepEqual(userMan.getUserConnections("qwer"),{},"Returns 0 if user conn left");
    conn1.close();
    test.equal(objLen(userMan.getUserConnections("asdf")),1,"Returns 1 after second left");

    test.done();
}
