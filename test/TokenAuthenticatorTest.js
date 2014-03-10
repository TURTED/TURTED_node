var TokenAuthenticator = require('../auth/TokenAuthenticator');

exports.createsCorrectMd5 = function (test) {
    test.expect(1);

    var ta = new TokenAuthenticator("qwer", "asdf", "md5");
    var id = "UserName";
    //qwerUserNameasdf
    test.strictEqual(ta.encode(id), "4111869600c9b953ea9c5558158b6aa6", "creates correct md5");
    test.done();
};

exports.fallsBackToMd5 = function (test) {
    test.expect(1);
    var ta = new TokenAuthenticator("qwer", "asdf");
    var id = "UserName";
    //qwerUserNameasdf
    test.strictEqual(ta.encode(id), "4111869600c9b953ea9c5558158b6aa6", "creates correct md5");
    test.done();
}

exports.createsCorrectSha1 = function (test) {
    test.expect(1);

    var ta = new TokenAuthenticator("qwer", "asdf", "sha1");
    var id = "UserName";
    //qwerUserNameasdf
    test.strictEqual(ta.encode(id), "4111869600c9b953ea9c5558158b6aa6", "falls back to md5 on missing algo");
    test.done();
};

exports.fallsBackToMd5OnIncorrect = function (test) {
    test.expect(1);

    var ta = new TokenAuthenticator("qwer", "asdf", "asdf");
    var id = "UserName";
    //qwerUserNameasdf
    test.strictEqual(ta.encode(id), "4111869600c9b953ea9c5558158b6aa6", "falls back to md5 on incorrect algo");
    test.done();
};

exports.createsCorrectSha1 = function (test) {
    test.expect(1);

    var ta = new TokenAuthenticator("qwer", "asdf", "sha1");
    var id = "UserName";
    //qwerUserNameasdf
    test.strictEqual(ta.encode(id), "038558ffa794e664b5225a399f1262ff1d6c1789", "creates correct sha1");
    test.done();
};

exports.verifyReturnsBoolean = function (test) {
    test.expect(2);
    var id = "UserName";
    //qwerUserNameasdf
    var ta = new TokenAuthenticator("qwer","asdf","sha1");
    test.strictEqual (ta.verify(id,"038558ffa794e664b5225a399f1262ff1d6c1789"),true,"returns true");
    test.strictEqual (ta.verify(id,"WRONG"),false,"returns false");
    test.done();
}
