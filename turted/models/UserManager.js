var RawData = require('./RawData');
var UserManager = function(auth) {
    this.auth = auth;
}

UserManager.prototype.handleIdent = function(conn,data) {
    var response = "UNIDENTIFIED";
    if ((data.hasOwnProperty("username")) && (data.hasOwnProperty("token"))) {
        if (this.auth.verify(data.username,data.token)) {
            response="IDENTIFIED";
        }
    }
    conn.send(new RawData().create(response,{}).toPlainObject());
}

module.exports = UserManager;