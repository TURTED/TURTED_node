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
    var rd = new RawData().create(response, responseData).encode();
    console.log(rd);
    conn.send(rd);
}

module.exports = UserManager;