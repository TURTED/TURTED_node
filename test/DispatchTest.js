var Dispatch = require('../models/Dispatch');

exports.dispatchBroadcast = function (test) {
    test.expect(9);
    var d = new Dispatch("e",{},{channels: ["asdf","qwer"]});
    test.deepEqual(d.getTargetChannels(),["asdf","qwer"]);
    test.deepEqual(d.getTargetUsers(),[]);
    test.equal(d.isBroadcast(),false);

    var d = new Dispatch("e",{},{channels: ["asdf","qwer"], users: ["alpha","beta"]});
    test.deepEqual(d.getTargetChannels(),["asdf","qwer"]);
    test.deepEqual(d.getTargetUsers(),["alpha","beta"]);

    var d = new Dispatch("e",{},{ users: ["alpha","beta"]});
    test.deepEqual(d.getTargetChannels(),[]);
    test.deepEqual(d.getTargetUsers(),["alpha","beta"]);
    test.equal(d.isBroadcast(),false);

    var d = new Dispatch("e",{},{broadcast: true});
    test.equal(d.isBroadcast(),true);
    test.done();
}


