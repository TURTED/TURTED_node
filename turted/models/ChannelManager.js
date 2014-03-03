var Channel = require('./Channel');
var Collection = require('./Collection');

var ChannelManager = function() {
    this.channels = new Collection();
}

ChannelManager.prototype.addConnection = function (conn) {
    conn.on("RX:JOIN", this.handleJoin.bind(this));
    conn.on("RX:LEAVE", this.handleLeave.bind(this));
}

ChannelManager.prototype.handleJoin = function(conn, data) {
    var channelName = "";

    if (data.hasOwnProperty("channel")) {
        channelName = data.channel;
    } else {
        return false;
    }

    if (!(typeof channelName === "string")) {
        return false;
    }
    if (channelName === "") {
        return false;
    }

    var channel;
    if (this.channels.exists(channelName)) {
        channel = this.channels.get(channelName);
    } else {
        channel = new Channel(channelName);
        this.channels.add(channelName,channel);

        channel.on("empty", function() {
            this.channels.remove(channelName);
            //console.log("Channel ", channelName, " is empty");
            channel=undefined;
        }.bind(this));
    }
    channel.join(conn);
}

ChannelManager.prototype.handleLeave = function(conn, data) {
    var channelName = "";
    if (data.hasOwnProperty("channel")) {
        channelName = data.channel;
    }

    var channel;
    if (this.channels.exists(channelName)) {
        channel=this.channels.get(channelName);
        channel.leave(conn);
    }
}

ChannelManager.prototype.getChannelConnections = function (channel) {
    return {};
}

module.exports = ChannelManager;