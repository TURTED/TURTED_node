var logger = require("./Logger");
var RawData = require('./RawData');
var Collection = require('./Collection');

var UserManager = function() {
    this.users = new Collection();
};

UserManager.prototype.addUserConnection = function(username, conn) {
    logger.debug("Add conn", conn.id, "for", username);
    if (!(this.users.has(username))) {
        this.users.add(username, new Collection());
    }
    this.users.get(username).add(conn.id, conn);
    conn.once("CLOSE", function() {
        logger.debug("Close connection", conn.id, "for user", username);
        this.delUserConnection.call(this, username, conn);
    }.bind(this));
};

UserManager.prototype.delUserConnection = function(username, conn) {
    var user = this.users.get(username);
    if (typeof user !== "undefined") {
        user.remove(conn.id);
        if (user.isEmpty()) {
            this.users.remove(username);
        }
    }
};

UserManager.prototype.getUserConnections = function(user) {
    if (this.users.has(user)) {
        return this.users.get(user).getItems();
    } else {
        return {};
    }
};

module.exports = UserManager;
