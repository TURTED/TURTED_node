var events = require("events");
var util = require("util");

var MockSock = function () {
    events.EventEmitter.call(this);
}

util.inherits(MockSock, events.EventEmitter);

MockSock.prototype.data = function() {
    this.emit("receive");
}

MockSock.prototype.close = function() {
    this.emit("close");
}

module.exports = MockSock;