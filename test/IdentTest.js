var Connection = require('../models/Connection')
var UserManager = require('../models/UserManager');
var ConnectionManager = require('../models/ConnectionManager');

function objLen(obj) {
    var i = 0;
    for (var k in obj) {
        i++;
    }
    return i;
}

var denyAuthenticator = {
    verify: function() {
        return false;
    }
};

var approveAuthenticator = {
    verify: function() {
        return true;
    }
};

exports.handleIdentSendsNegativeResponseToConnection = function(test) {
    test.expect(2);
    var conn = new Connection({});
    var userMan = new UserManager();
    var connMan = new ConnectionManager({
        authenticator: denyAuthenticator,
        usermanager: userMan
    });

    //usermanger needs to call send on connection, lets intercept the call and test it
    conn.send = function(event, data) {
        test.equal("ERROR", event, "UserManager sends error");
        test.equal("IDENT not verified", data, "Error message");
    };

    connMan.addConnection(conn);
    conn.receive("ident", {});
    test.done();
};

exports.handleIdentSendsPositiveResponseToConnection = function(test) {
    test.expect(2);

    var conn = new Connection({});
    var userMan = new UserManager();
    var connMan = new ConnectionManager({
        authenticator: approveAuthenticator,
        usermanager: userMan
    });

    //usermanger needs to call send on connection, lets intercept the call and test it
    conn.send = function(event, data) {
        test.equal("OK", event, "UserManager sends ok");
        test.deepEqual(data, {username: "fred"}, "Returns username");
    };

    connMan.addConnection(conn);
    conn.receive("ident", {"username": "fred"});
    test.done();
};

exports.returnsAllUsersConnections = function(test) {
    test.expect(6);

    //mock an authenticator that always accepts
    var auth = {};
    auth.verify = function() {
        return true;
    }

    var userMan = new UserManager(auth);
    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var conn3 = new Connection({});
    userMan.addUserConnection("asdf", conn1);
    userMan.addUserConnection("asdf", conn2);
    userMan.addUserConnection("qwer", conn3);

    test.equal(objLen(userMan.getUserConnections("asdf")), 2, "Returns 2 for asdf");
    test.equal(objLen(userMan.getUserConnections("qwer")), 1, "Returns 1 for qwer");
    test.deepEqual(userMan.getUserConnections("none"), {}, "Returns 0 for non-existant");
    conn3.close();
    test.deepEqual(userMan.users.has("qwer"), false, "User is unregistered if his last connection left");
    test.deepEqual(userMan.getUserConnections("qwer"), {}, "Returns 0 if user conn left");
    conn1.close();
    test.equal(objLen(userMan.getUserConnections("asdf")), 1, "Returns 1 after second left");

    test.done();
}
