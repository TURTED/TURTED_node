var RawData = require('./RawData');
var Collection = require('./Collection');

var UserManager = function (auth) {
    this.auth = auth;
    this.users = new Collection();

    this.addConnection.bind(this);
}

UserManager.prototype.addConnection = function (conn) {
    //register events that userMan cares about
    conn.on("RX:IDENT", function (conn, data) {
        this.handleIdent.call(this, conn, data);
    }.bind(this));
}

UserManager.prototype.handleIdent = function (conn, data) {
    var response = "ERR";
    var responseData = {ERR: "UNIDENTIFIED"};
    if ((data.hasOwnProperty("username")) && (data.hasOwnProperty("token"))) {
        if (this.auth.verify(data.username, data.token)) {
            response = "IDENTIFIED";
            responseData = {};
        }
    }
    this.addUserConnection(data.username,conn);
    var rd = new RawData().create(response, responseData).encode();
    //console.log(rd);
    conn.send(rd);
}

UserManager.prototype.addUserConnection  = function (username, conn) {
    if (!(this.users.has(username))) {
        this.users.add(username, new Collection());
    }
    this.users.get(username).add(conn.id, conn);
    conn.on("close",function() {
        this.delUserConnection.call(this,username, conn);
    }.bind(this));
}

UserManager.prototype.delUserConnection  = function (username, conn) {
    var user = this.users.get(username);
    user.remove(conn.id);
    if (user.isEmpty()) {
        this.users.remove(username);
    }
}

UserManager.prototype.getUserConnections = function (user) {
    if (this.users.has(user)) {
        return this.users.get(user).getItems();
    } else {
        return {};
    }
}

module.exports = UserManager;