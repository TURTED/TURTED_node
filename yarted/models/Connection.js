var util = require('util');
var events = require('events');
/**
 * Connection is an abstraction of a native connection so we don't have to deal with client implementation
 *
 * @param nativeConnection
 * @constructor
 */

var Connection = function (nativeConnection) {
    console.log("New connection");
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
    console.log(this.id);
}

util.inherits(Connection, events.EventEmitter);

Connection.prototype.receive = function (message) {
    console.log("YartedConnection got a message", message);
    this.emit("receive", message);
}

Connection.prototype.close = function () {
    console.log("YartedConnection close");
    //this.emit("close");
}

Connection.prototype.send = function (message) {
    console.log("Sending a message ", message);
    this.emit("send", message);
}

module.exports = Connection;