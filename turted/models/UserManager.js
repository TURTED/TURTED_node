var RawData = require('./RawData');
var Collection = require('./Collection');

var UserManager = function (auth) {
    this.auth = auth;
    this.users = new Collection();
}

UserManager.prototype.addConnection = function (conn) {
    //register events that userMan cares about
    conn.on("RX:IDENT", this.handleIdent);
}

UserManager.prototype.handleIdent = function (conn, data) {
    var response = "UNIDENTIFIED";
    if ((data.hasOwnProperty("username")) && (data.hasOwnProperty("token"))) {
        if (this.auth.verify(data.username, data.token)) {
            response = "IDENTIFIED";
        }
    }
    conn.send(new RawData().create(response, {}).toPlainObject());
}

module.exports = UserManager;