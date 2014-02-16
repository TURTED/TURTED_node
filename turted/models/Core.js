var Collection = require('./Collection');
var Dispatch = require('./Dispatch');
var Dispatcher = require('./Dispatcher');

var Core = function () {
    this.connections = new Collection();
    this.dispatcher = new Dispatcher();
}

Core.prototype.addConnection = function (conn) {
    this.connections.add(conn.id, conn);

    //bind to connection events
    conn.on("receive", function (data) {
        console.log("Our YartedConnection received something. DEAL WITH IT!!!", data);
        for (connId in this.connections.items) {
            var c = this.connections.items[connId];
            c.send(data);
        }
    }.bind(this));

    conn.on("message", this.message);
    conn.on("ident", this.ident);
    conn.on("join", this.join);
    conn.on("leave", this.leave);

    console.log("Connections: ", this.connections.length());
    conn.emit("join", "chat");
}

Core.prototype.removeConnection = function (conn) {
    this.connections.remove(conn.id);
    console.log("Connections: ", this.connections.length());
}

Core.prototype.dispatchEventDataTarget = function (e,data,targets) {
    var dispatch = new Dispatch(e, data, targets);
    this.dispatcher.dispatch(dispatch);
}

//Event handling functions, expect "this" to be the connection
Core.prototype.message = function (message) {
    console.log("Here Core! ", this.id, " sent ", message);
}

Core.prototype.ident = function (id, username, token) {
    console.log("IDENT");
}

Core.prototype.join = function (channel) {
    console.log("JOIN", channel);
}

Core.prototype.leave = function (channel) {
    console.log("LEAVE", channel);
}

module.exports = Core;