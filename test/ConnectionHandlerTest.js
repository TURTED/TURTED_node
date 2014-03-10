var Connection = require('../models/Connection');
var ConnectionHandler = require('../models/ConnectionHandler');
var ConnectionManager = require('../models/ConnectionManager');
var UserManager = require('../models/UserManager');
var ChannelManager = require('../models/ChannelManager');
var Dispatch = require('../models/Dispatch');


exports.resolve = function (test) {
    test.expect(13);

    var auth = {
        verify: function() { return true}
    };

    var conn1 = new Connection({});
    var conn2 = new Connection({});
    var conn3 = new Connection({});
    var conn4 = new Connection({});
    var conn5 = new Connection({});
    var conn6 = new Connection({});
    var conn7 = new Connection({});
    var conn8 = new Connection({});
    var conn9 = new Connection({});
    var conn10 = new Connection({});

    var connMan = new ConnectionManager();
    var userMan = new UserManager(auth);
    var chanMan = new ChannelManager();
    var connHandler = new ConnectionHandler(connMan, userMan, chanMan);

    connHandler.addConnection(conn1);

    var d;
    var expectation;
    d= new Dispatch("test","data",{broadcast:true});
    connHandler.resolve(d);
    expectation = {};
    expectation[conn1.id]=conn1;
    test.deepEqual(d.getTargetConnections(),expectation);
    conn1.close();


    connHandler.addConnection(conn2);
    chanMan.handleJoin(conn2, {channel: "test1"});
    d = new Dispatch("test","data",{channels:["test1"]});
    connHandler.resolve(d);
    expectation = {};
    expectation[conn2.id]=conn2;
    test.deepEqual(d.getTargetConnections(),expectation);
    conn2.close();

    connHandler.addConnection(conn3);
    chanMan.handleJoin(conn3, {channel: "test1"});
    userMan.handleIdent(conn4, {id: 123, username: "asdf", token: "9856099"});
    d = new Dispatch("test","data",{channels:["test1"]});
    connHandler.resolve(d);
    expectation = {};
    expectation[conn3.id]=conn3;
    test.deepEqual(d.getTargetConnections(),expectation);
    conn3.close();
    conn4.close();

    chanMan.handleJoin(conn5, {channel: "test1"});
    chanMan.handleJoin(conn6, {channel: "test1"});
    userMan.handleIdent(conn6, {id: 123, username: "asdf", token: "9856099"});

    chanMan.handleJoin(conn7, {channel: "another"});
    userMan.handleIdent(conn8, {id: 123, username: "another", token: "9856099"});

    d = new Dispatch("test","data",{channels:["test1"], users: ["asdf"]});
    connHandler.resolve(d);
    expectation = {};
    expectation[conn5.id]=conn5;
    expectation[conn6.id]=conn6;
    test.deepEqual(d.getTargetConnections(),expectation);

    userMan.handleIdent(conn9, {id: 123, username: "asdf", token: "9856099"});
    connHandler.resolve(d);

    var num=0;
    for (var i in d.getTargetConnections()) {
        num++;
    }
    test.equal(num,3,"returns 3 targets");
    test.equal(d.getTargetConnections().hasOwnProperty(conn5.id),true,"5 is in");
    test.equal(d.getTargetConnections().hasOwnProperty(conn6.id),true,"6 is in");
    test.equal(d.getTargetConnections().hasOwnProperty(conn9.id),true,"9 is in");

    userMan.handleIdent(conn10,{id:5, username: "second",token: "asdf"});

    d = new Dispatch("test","data",{channels:["test1"], users: ["asdf","second"]});
    connHandler.resolve(d);

    var num=0;
    for (var i in d.getTargetConnections()) {
        num++;
    }
    test.equal(num,4,"returns 4 targets");
    test.equal(d.getTargetConnections().hasOwnProperty(conn5.id),true,"5 is in");
    test.equal(d.getTargetConnections().hasOwnProperty(conn6.id),true,"6 is in");
    test.equal(d.getTargetConnections().hasOwnProperty(conn9.id),true,"9 is in");
    test.equal(d.getTargetConnections().hasOwnProperty(conn10.id),true,"10 is in");


    test.done();
};
