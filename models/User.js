var Collection = require('./Collection');

var User = function(name) {
    this.name = name;
    this.connections = new Collection();
}

User.prototype.add = function(conn) {
    this.connections.add(conn.id, conn);
    conn.on("close",this.remove.bind(this))
}

User.prototype.remove = function(conn) {
    this.connections.remove(conn.id);
}

module.exports = User;