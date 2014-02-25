var Collection = require('./Collection');
var ConnectionManager = function() {

    this.connections = new Collection();
}

ConnectionManager.prototype.addConnection = function(conn) {
    this.connections.add(conn.id,conn);

    conn.on("close", function() {
        this.connections.remove(conn.id);
    }.bind(this));
}

module.exports = ConnectionManager;