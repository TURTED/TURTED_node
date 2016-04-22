var events = require("events");
var util = require("util");

var MockServ = function() {
    events.EventEmitter.call(this);
};

util.inherits(MockServ, events.EventEmitter);

MockServ.prototype.nativeConnect = function(nativeConnection) {
    this.emit("connection", nativeConnection);
};

module.exports = MockServ;