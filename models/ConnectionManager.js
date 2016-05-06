var logger = require("./Logger");
var _ = require("lodash-node");
var Collection = require('./Collection');

var ConnectionManager = function(options) {
    options = options || {};
    //console.log("ConMan options", options);

    this.authenticator = options.authenticator ? options.authenticator : false;
    this.userManager = options.usermanager ? options.usermanager : false;
    this.channelManager = options.channelmanager ? options.channelmanager : false;

    //console.log("UMan, chanMan", this.userManager, this.channelManager);

    this.connections = new Collection();
    this.ident.bind(this);
    this.join.bind(this);
    this.resolve.bind(this);
};

ConnectionManager.prototype.addConnection = function(conn) {
    this.connections.add(conn.id, conn);
    var me = this;

    conn.once("CLOSE", function() {
        logger.debug("Remove connection and listeners");
        conn.removeListener("ECHO", me.echo.bind(me));
        conn.removeListener("IDENT", me.ident.bind(me));
        conn.removeListener("JOIN", me.join.bind(me));
        this.connections.remove(conn.id);
    }.bind(this));

    //simple echo test
    conn.on("ECHO", me.echo.bind(me));
    conn.on("IDENT", me.ident.bind(me));
    conn.on("JOIN", me.join.bind(me));
};

ConnectionManager.prototype.getConnections = function() {
    return this.connections.getItems();
};

//protocol event handling functions
ConnectionManager.prototype.echo = function(conn, data) {
    conn.send("ECHO", data);
};

ConnectionManager.prototype.ident = function(conn, data) {
    logger.debug("Got ident on ", conn.id, "with", data);

    //console.log("My usermanager for ident", this.userManager);
    if (!this.userManager) {
        logger.debug("No usermanager registered, cannot handle IDENT");
        return false;
    }

    if (this.authenticator) {
        if (!this.authenticator.verify(data)) {
            conn.send("ERROR", "IDENT not verified");
            return false;
        }
    }
    var username = data.username || data.user;
    if (!username) {
        logger.debug("No user/username property");
        return false;
    }

    this.userManager.addUserConnection(username, conn);
    conn.send("OK",{username: username});
};

ConnectionManager.prototype.join = function(conn, data) {
    logger.debug("Got join on ", conn.id, "with", data);
    if (!this.channelManager) {
        logger.debug("No channelmanager registered, cannot handle JOIN");
        return false;
    }

    var channel = data.channel;
    if (!channel) {
        logger.debug("No channel property");
        return false;
    }

    this.channelManager.handleJoin(channel, conn);
    conn.send("OK",{channel:channel});
};

ConnectionManager.prototype.clientmessage = function(conn, message) {
    //the client sent a message
    logger.debug("Here ConnectionManager! ", conn.id, " sent ", message);
    conn.send(new RawData().create("welcome").encode());
};

ConnectionManager.prototype.resolve = function(dispatch) {
    logger.debug("Resolving dispatch");
    
    logger.debug("check for broadcast");
    if (dispatch.isBroadcast()) {
        logger.debug("handle broadcast");
        dispatch.addTargetConnections(this.getConnections());
        return true;
    }

    //check for users
    _.each(dispatch.getTargetUsers(), function(username) {
        logger.debug("resolving user", username);
        dispatch.addTargetConnections(this.userManager.getUserConnections(username));
    }.bind(this));

    if (this.channelManager) {
        //check for channels
        _.each(dispatch.getTargetChannels(), function(channel) {
            logger.debug("resolving channel", channel);
            dispatch.addTargetConnections(this.channelManager.getChannelConnections(channel));
        }.bind(this))
    }
};

module.exports = ConnectionManager;