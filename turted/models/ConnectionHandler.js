var ConnectionHandler = function (connMan, userMan, chanMan) {
    this.connectionManager = connMan;
    this.userManager = userMan;
    this.channelManager = chanMan;
}

ConnectionHandler.prototype.addConnection = function (conn) {

    //inform all managers about connection
    this.connectionManager.addConnection(conn);
    this.userManager.addConnection(conn);
    this.channelManager.addConnection(conn);

    //bind to known protocol events
    conn.on("message", this.message);

    conn.on("close", function() {
        //here, "this" is the connection
        connMan.removeConnection(this);
        //console.log("disconnected");
    });

    conn.on("OK:identified", function() {

    });

    //console.log("Connections: ", this.connections.length());

}

//protocol event handling functions
ConnectionHandler.prototype.message = function (conn, message) {
    //the client sent a message
    console.log("Here ConnectionHandler! ", conn.id, " sent ", message);
}

module.exports = ConnectionHandler;