var Collection = require('./Collection');

var Core = function () {
    this.connections = new Collection();
}

Core.prototype.addConnection = function(conn) {
    this.connections.add(conn.id,conn);
    conn.on("receive",function(data) {
        console.log("Our YartedConnection received something. DEAL WITH IT!!!",data);
    })
    console.log("Connections: ",this.connections.length());
}

Core.prototype.removeConnection = function(conn) {
    this.connections.remove(conn.id);
    console.log("Connections: ",this.connections.length());
}

Core.prototype.message = function(conn, message) {
}

Core.prototype.ident = function(conn, id, username, token) {
}

Core.prototype.join = function (conn, channel) {
}

Core.prototype.leave = function(conn, channel) {
}

module.exports = Core;