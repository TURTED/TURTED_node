var Connection = require('../models/Connection')
var UserManager = require('../models/UserManager');

function objLen (obj) {
    var i=0;
    for (var k in obj) {
        i++;
    }
    return i;
}

exports.handleIdentSendsNegativeResponseToConnection = function (test) {
    test.expect(1);
    var conn = new Connection({});

    //mock an authenticator that always denies
    var auth = {};
    auth.verify = function () {
        return false;
    }

    var userMan = new UserManager(auth);

    conn.send = function (data) {
        //usermanger needs to call send on connection
        test.deepEqual(data, JSON.stringify({type: "ERR", data: {ERR: "UNIDENTIFIED"}}), "UserManager sent negative response to connection");
    }

    userMan.handleIdent(conn, {id: 123, username: "asdf", token: "9856099"});
    test.done();
};

exports.handleIdentSendsPositiveResponseToConnection = function (test) {
    test.expect(1);
    var conn = new Connection({});

    //mock an authenticator that always accepts
    var auth = {};
    auth.verify = function () {
        return true;
    }

    var userMan = new UserManager(auth);

    conn.send = function (data) {
        //usermanger needs to call send on connection
        test.deepEqual(data, JSON.stringify({type: "IDENTIFIED", data: {}}), "UserManager sent negative response to connection");
        test.done();
    }

    userMan.handleIdent(conn, {id: 123, username: "asdf", token: "9856099"});
};

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
    userMan.handleIdent(conn1, {id: 12, username: "asdf", token: "9856099"});
    userMan.handleIdent(conn2, {id: 12, username: "asdf", token: "985099"});
    userMan.handleIdent(conn3, {id: 13, username: "qwer", token: "98599"});

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
