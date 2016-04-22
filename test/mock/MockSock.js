var events = require("events");
var util = require("util");

var MockSock = function() {
    events.EventEmitter.call(this);
};

util.inherits(MockSock, events.EventEmitter);

//SockJS
MockSock.prototype.data = function() {
    this.emit("receive");
};

//SockJS
MockSock.prototype.close = function() {
    this.emit("close");
};

//Socketio
MockSock.prototype.disconnect = function() {
    this.emit("disconnect");
};

module.exports = MockSock;