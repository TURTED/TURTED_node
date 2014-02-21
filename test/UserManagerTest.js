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

    /*
    conn.send = function (data) {
        //usermanger needs to call send on connection
        console.log("I HAVE BEEN CALLED");
        clearTimeout(errTO);
        test.ok(true, "UserManager sent negative response to connection");
        test.done();
    }
    */

    userMan.handleIdent({id: 123, username: "asdf", token: "9856099"}).bind(conn);
    console.log("Hier");
    test.done();
    console.log("Hier auch");
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

    var errTO = setTimeout(function () {
        test.ok(false, "Expected reponse event did not fire");
        test.done();
    }, 50);

    conn.send = function (data) {
        clearTimeout(errTO);
        test.ok(true, "UserManager sent negative response to connection");
        test.done();
    }

    userMan.handleIdent({id: 123, username: "asdf", token: "9856099"}).bind(conn);
    test.done();
};

