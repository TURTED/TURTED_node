var events = require('events');
var util = require('util');
var RawData = require('./RawData');

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

    if (typeof nativeConnection.on !== "undefined") {
        nativeConnection.on("close",this.close.bind(this));
    }

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
    //console.log("Abstracted connection got a message", message);

    //decode incoming message
    var rd = new RawData(message);

    //if it is a valid packet, emit event type from package
    if (rd.isValid()) {
        var t = rd.getType();
        var d = rd.getData();

        //emit named event type with RX prefix to avoid client sending "internal" commands as events
        //emits event, connection and data
        this.emit("RX:" + t.toUpperCase(), this, d);
    } else {
        console.log("Dropping invalid message ",message);
    }
}

Connection.prototype.close = function () {
    //console.log("Abstract connection close");
    this.emit("close",this);
}

Connection.prototype.send = function (message) {
    console.log("Sending a message ", message);
    this.emit("send", message);
}

module.exports = Connection;