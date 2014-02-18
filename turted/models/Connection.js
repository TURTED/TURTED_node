var events = require('events');
var util = require('util');

/**
 * Connection is an abstraction of a native connection so we don't have to deal with client implementation
 *
 * @param nativeConnection
 * @constructor
 */

var Connection = function (nativeConnection) {
    //console.log("New connection");
    if (typeof nativeConnection === "undefined") {
        throw "NO_NATIVE_CONNECTION";
    }

    this.nativeConnection = nativeConnection;

    if (nativeConnection.id) {
        this.id = nativeConnection.id;
    } else {
        //some long id
        var n = 2;
        this.id = Array.apply(0, Array(n)).reduce(function (p) {
            return p + (Math.random() * 1e18).toString(36)
        }, '');
    }
    //console.log(this.id);
    events.EventEmitter.call(this);
}

util.inherits(Connection, events.EventEmitter);
//Connection.prototype.__proto__ = events.EventEmitter.prototype;

Connection.prototype.receive = function (message) {
    console.log("YartedConnection got a message", message);
    //decode incoming message
    //if it is a valid packet, emit event type from package

    console.log(this.emit("receive", message));

    //temp thing, so something happens at all. We treat native data like a message
    console.log(this.emit("message",message));
}

Connection.prototype.close = function () {
    console.log("YartedConnection close");
    this.emit("close");
}

Connection.prototype.send = function (message) {
    console.log("Sending a message ", message);
    this.emit("send", message);
}

module.exports = Connection;