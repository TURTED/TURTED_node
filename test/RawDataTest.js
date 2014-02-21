var RawData = require('../turted/models/RawData')

exports.rawDataValidation = function (test) {
    test.expect(5);
    var rawData;
    var rd;

    rawData = {'type': 'newmsg', data: { id: 1, name: "Test" } };
    rd = new RawData(rawData);
    test.strictEqual(rd.isValid(),true,"Validates correct data");

    rawData = "Bla";
    rd = new RawData(rawData);
    test.strictEqual(rd.isValid(),false,"Rejects string");

    rawData = {};
    rd = new RawData(rawData);
    test.strictEqual(rd.isValid(),false,"Rejects empty object");

    rawData = {type:"event"};
    rd = new RawData(rawData);
    test.strictEqual(rd.isValid(),true,"Accepts event type only");

    rawData = "type";
    rd = new RawData(rawData);
    test.strictEqual(rd.isValid(),false,"Rejects string 'type'");

    test.done();
}
;

exports.getRawDataComponents = function (test) {
    test.expect(4);

    rawData = {'type': 'newmsg', data: { id: 1, name: "test" } };
    rd = new RawData(rawData);
    test.equal(rd.getType(),"newmsg","Returns event type");

    var data = rd.getData();
    test.equal(data.hasOwnProperty("id"),true,"data has correct property");
    test.equal(data.id,1,"data has correct values");
    test.equal(rd.getData().name,"test","Returns event data");

    test.done();
}

exports.createRawData = function (test) {
    test.expect(1);

    var rd = new RawData().create("ident",{"user": "Turtle", "password": "12345"});

    test.deepEqual(rd.toPlainObject(), { type: "ident", data: { user: "Turtle", password: 12345}});
    test.done();
}
