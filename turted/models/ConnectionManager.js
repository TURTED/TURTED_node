var Collection = require('./Collection');
var Dispatch = require('./Dispatch');

var ConnectionManager = function () {
    this.connections = new Collection();
}

ConnectionManager.prototype.addConnection = function (conn) {
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

    //only for testing
    conn.emit("join", "chat");
}

ConnectionManager.prototype.removeConnection = function (conn) {
    this.connections.remove(conn.id);
    console.log("Connections: ", this.connections.length());
}

//Event handling functions, expect "this" to be the connection
ConnectionManager.prototype.message = function (message) {
    console.log("Here ConnectionManager! ", this.id, " sent ", message);
}

ConnectionManager.prototype.ident = function (id, username, token) {
    console.log("IDENT");
}

ConnectionManager.prototype.join = function (channel) {
    console.log("JOIN", channel);
}

ConnectionManager.prototype.leave = function (channel) {
    console.log("LEAVE", channel);
}

module.exports = ConnectionManager;