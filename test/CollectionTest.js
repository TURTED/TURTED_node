var Collection = require('../models/Collection');

exports.collectionTests = function(test) {
    var i = 0;
    test.expect(9);

    var c = new Collection();
    test.equal(c.isEmpty(), true, "is empty");
    c.add("asdf", "foo");
    test.equal(c.isEmpty(), false, "is not empty");

    test.equal(c.length(), 1, "length is one");
    c.add("asdf", "again");
    test.equal(c.length(), 1, "length is one");
    test.equal(c.get("asdf"), "again", "val is overwritten");

    for (i = 0; i < 100; i++) {
        c.add("asdf" + i, i);
    }
    test.equal(c.length(), 101, "is 101 now");

    for (i = 0; i < 100; i++) {
        c.remove("asdf" + i);
    }
    test.equal(c.length(), 1, "is 1 again");
    
    var n = new Collection();
    n.add(1001, "asdf");
    n.add (15, "foo");
    n.add (055, "foo");
    test.equal(n.length(), 3, "numeric keys don't break it");
    
    n.add("asdf", "nana");
    test.equal(n.length(), 4, "mixed keys don't break it");

    test.done();
};
