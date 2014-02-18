var events = require("events");

var MockSock = function () {

    events.EventEmitter.call(this);
}

util.inherits(MockSock, events.EventEmitter);

MockSock.prototype.ident = function() {
    this.emit("ident");
}

module.exports = MockSock;