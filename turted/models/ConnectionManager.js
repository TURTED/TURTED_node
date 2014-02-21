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

    conn.on("RX:IDENT", userMan.handleIdent);

    conn.on("join", this.join);
    conn.on("leave", this.leave);
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

//protocol event handling functions, expect "this" to be the connection
ConnectionManager.prototype.message = function (message) {
    //the client sent a message
    console.log("Here ConnectionManager! ", this.id, " sent ", message);
}

ConnectionManager.prototype.ident = function (id, username, token) {
    //the client wants to authenticate
    console.log("IDENT");
    console.log("THis",this);
    console.log("arg1:",id);
    console.log("arg2:",username);
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