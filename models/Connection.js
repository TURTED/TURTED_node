var logger = require("./Logger");
var events = require('events');
var util = require('util');

/**
 * Connection is an abstraction of a native connection so we don't have to deal with client implementation
 *
 * @param nativeConnection
 * @constructor
 */

var Connection = function(nativeConnection) {
    logger.debug("New connection");
    if (typeof nativeConnection === "undefined") {
        throw "NO_NATIVE_CONNECTION";
    }

    this.nativeConnection = nativeConnection;

    /**
     * COnnection should not implement specific native evetns - needs to be done by CLientConnector
     */
    //if (typeof nativeConnection.on !== "undefined") {
    //nativeConnection.on("disconnect", this.close.bind(this));
    //}

    if (nativeConnection.id) {
        this.id = nativeConnection.id;
    } else {
        //some long id
        var n = 2;
        this.id = Array.apply(0, Array(n)).reduce(function(p) {
            return p + (Math.random() * 1e18).toString(36)
        }, '');
    }
    logger.debug(this.id);
    events.EventEmitter.call(this);
}

util.inherits(Connection, events.EventEmitter);
//Connection.prototype.__proto__ = events.EventEmitter.prototype;

Connection.prototype.receive = function(cmd, data) {
    logger.debug("TURTED Connection got a cmd", cmd, "with data", data);
    this.emit(cmd.toUpperCase(), this, data);
}

Connection.prototype.close = function() {
    logger.debug("TURTED Connection", this.id, "CLOSE called");
    this.emit("CLOSE", this);
}

Connection.prototype.send = function(message) {
    logger.error("NEED TO OVERWRITE THIS IN ClientConnector");
}

module.exports = Connection;