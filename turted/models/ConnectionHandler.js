var RawData = require('./RawData');

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


    //we'll see later how this will be taken care of...
    conn.on("RX:MESSAGE", function(conn,data) {
        this.message.call(this,conn,data);
    }.bind(this));

    //simple echo test
    conn.on("RX:ECHO",function(conn, data) {
        console.log("Got echo message ",data)
        console.log("Sending back ")
        conn.send(new RawData().create("message",data).toPlainObject());
    })
}

//protocol event handling functions
ConnectionHandler.prototype.message = function (conn, message) {
    //the client sent a message
    console.log("Here ConnectionHandler! ", conn.id, " sent ", message);
    conn.send(new RawData().create("welcome").toPlainObject());
}

module.exports = ConnectionHandler;