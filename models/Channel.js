var logger = require("./Logger");
var events = require('events');
var util = require('util');
var Collection = require('./Collection');

var Channel = function (name) {
    this.name = name;
    this.connections = new Collection();
    events.EventEmitter.call(this);
}

util.inherits(Channel, events.EventEmitter);

Channel.prototype.join = function (conn) {
    this.connections.add(conn.id, conn);
    conn.on("close", this.leave.bind(this))
}

Channel.prototype.leave = function (conn) {
    this.connections.remove(conn.id);
    if (this.connections.length() === 0) {
        logger.debug("Channel ", this.name, " is empty");
        this.emit("empty", this);
    }
}

Channel.prototype.getConnections = function () {
    return this.connections.getItems();
}

module.exports = Channel;