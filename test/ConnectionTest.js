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
}
