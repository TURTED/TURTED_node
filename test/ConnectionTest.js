var Connection = require('../turted/models/Connection')

exports.connectionHasId = function (test) {
    test.expect(1);
    var conn = new Connection({});
    test.ok((conn.hasOwnProperty("id")), "Connection has an id");
    test.done();
};

exports.connectionIdsAreUnique = function (test) {
    test.expect(1);
    var conn1 = new Connection({});
    var conn2 = new Connection({});
    test.notStrictEqual(conn1.id, conn2.id, "Connection IDs are unique");
    test.done();
};

exports.connectionEmitsIncomingEvents = function (test) {
    var conn = new Connection({});
    test.expect(1);

    var errTO = setTimeout(function () {
        test.ok(false, "Expected 'YES:IT:WORKS' event did not fire");
        test.done();
    }, 50);

    conn.on("RX:YES:IT:WORKS", function () {
        clearTimeout(errTO);
        test.ok(true, "Package fired 'YES:IT:WORKS' event")
        test.done();
    })
    conn.receive({type:"YES:IT:WORKS"});
}
