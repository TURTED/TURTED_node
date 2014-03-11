var logger = require("./logger");
var _ = require("lodash-node");
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
    conn.on("RX:MESSAGE", this.message.bind(this));

    //simple echo test
    conn.on("RX:ECHO",function(conn, data) {
        logger.debug("Got echo message ",data)
        logger.debug("Sending back ")
        conn.send(new RawData().create("message",data).encode());
    })
}

//protocol event handling functions
ConnectionHandler.prototype.message = function (conn, message) {
    //the client sent a message
    logger.debug("Here ConnectionHandler! ", conn.id, " sent ", message);
    conn.send(new RawData().create("welcome").encode());
}

ConnectionHandler.prototype.resolve = function (dispatch) {
    //check for broadcast
    if (dispatch.isBroadcast()) {
        dispatch.addTargetConnections(this.connectionManager.getConnections());
        return true;
    }

    //check for users
    _.each(dispatch.getTargetUsers(),function(username) {
        logger.debug("resolving user",username);
        dispatch.addTargetConnections(this.userManager.getUserConnections(username));
    }.bind(this));

    //check for channels
    _.each(dispatch.getTargetChannels(),function(channel) {
        logger.debug("resolving channel",channel);
        dispatch.addTargetConnections(this.channelManager.getChannelConnections(channel));
    }.bind(this))
}

module.exports = ConnectionHandler;