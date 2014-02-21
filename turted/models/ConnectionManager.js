var Collection = require('./Collection');
var Dispatch = require('./Dispatch');
var UserManager = require('./UserManager');
var ChannelManager = require('./ChannelManager');

var ConnectionManager = function (authenticator) {
    this.authenticator = authenticator;
    this.userManager = new UserManager();
    this.channelManager = new ChannelManager();

    this.connections = new Collection();
    this.users = new Collection();
    this.channels = new Collection();
}

ConnectionManager.prototype.addConnection = function (conn) {
    var connMan = this;
    var userMan = this.userManager;
    var chanMan = this.channelManager;

    this.connections.add(conn.id, conn);

    //bind to known protocol events
    conn.on("message", this.message);

    conn.on("RX:IDENT", userMan.handleIdent.bind(userMan));
    conn.on("RX:JOIN", chanMan.handleJoin.bind(chanMan));
    conn.on("RX:LEAVE", chanMan.handleLeave.bind(chanMan))

    conn.on("close", function() {
        //here, "this" is the connection
        connMan.removeConnection(this);
        //console.log("disconnected");
    });

    conn.on("OK:identified", function() {

    });

    //console.log("Connections: ", this.connections.length());

}

ConnectionManager.prototype.removeConnection = function (conn) {
    this.connections.remove(conn.id);
    //console.log("Connections: ", this.connections.length());
}

//protocol event handling functions
ConnectionManager.prototype.message = function (conn, message) {
    //the client sent a message
    console.log("Here ConnectionManager! ", conn.id, " sent ", message);
}

module.exports = ConnectionManager;