var Connection = require('../turted/models/Connection')
var UserManager = require('../turted/models/UserManager');

exports.handleIdentSendsNegativeResponseToConnection = function (test) {
    test.expect(1);
    var conn = {};

    //mock an authenticator that always denies
    var auth = {};
    auth.verify = function () {
        return false;
    }

    var userMan = new UserManager(auth);

    conn.send = function (data) {
        //usermanger needs to call send on connection
        test.deepEqual(data, {type: "UNIDENTIFIED", data: {}}, "UserManager sent negative response to connection");
    }

    userMan.handleIdent(conn, {id: 123, username: "asdf", token: "9856099"});
    test.done();
};

exports.handleIdentSendsPositiveResponseToConnection = function (test) {
    test.expect(1);
    var conn = {};

    //mock an authenticator that always accepts
    var auth = {};
    auth.verify = function () {
        return true;
    }

    var userMan = new UserManager(auth);

    conn.send = function (data) {
        //usermanger needs to call send on connection
        console.log("I HAVE BEEN CALLED");
        test.deepEqual(data, {type: "IDENTIFIED", data: {}}, "UserManager sent negative response to connection");
        test.done();
    }

    userMan.handleIdent(conn, {id: 123, username: "asdf", token: "9856099"});
};

