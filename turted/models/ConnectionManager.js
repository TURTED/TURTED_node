var Collection = require('./Collection');
var Dispatch = require('./Dispatch');

var ConnectionManager = function () {
    this.connections = new Collection();

}

ConnectionManager.prototype.addConnection = function (conn) {
    this.connections.add(conn.id, conn);
    var connMan = this;

    //bind to known protocol events
    conn.on("message", this.message);
    conn.on("ident", this.ident);
    conn.on("join", this.join);
    conn.on("leave", this.leave);
    conn.on("close", function() {
        //here, "this" is the connection
        connMan.removeConnection(this);
        //console.log("disconnected");
    });

    //console.log("Connections: ", this.connections.length());

}

ConnectionManager.prototype.removeConnection = function (conn) {
    this.connections.remove(conn.id);
    //console.log("Connections: ", this.connections.length());
}

//protocol event handling functions, expect "this" to be the connection
ConnectionManager.prototype.message = function (message) {
    //the client sent a message
    console.log("Here ConnectionManager! ", this.id, " sent ", message);
}

ConnectionManager.prototype.ident = function (id, username, token) {
    //the client wants to authenticate
    console.log("IDENT");
}

ConnectionManager.prototype.join = function (channel) {
    //the client wants to join a channel
    console.log("JOIN", channel);
}

ConnectionManager.prototype.leave = function (channel) {
    //the client wants to leave a channel
    console.log("LEAVE", channel);
}

module.exports = ConnectionManager;