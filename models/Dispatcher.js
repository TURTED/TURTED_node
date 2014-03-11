var logger = require("./logger");
var RawData = require('./RawData');
var Dispatch = require('./Dispatch');

var Dispatcher = function (connHandler) {
    this.ConnectionHandler = connHandler;
    logger.debug("Dispatcher created");
}

/**
 * Takes a dispatch paket, resolves all recipients and forwards it for delivery
 * @param dispatch
 * @returns {boolean}
 */
Dispatcher.prototype.dispatch = function (dispatch) {
    logger.debug("Now I'm resolving it!");
    this.ConnectionHandler.resolve(dispatch);

    logger.debug("Now creating raw data");
    var rd = new RawData().create(dispatch._event,dispatch._payload).encode();

    logger.debug("Now I'm dispatchin it!");
    var targetConnections = dispatch.getTargetConnections();
    for (connId in targetConnections) {
        var conn = targetConnections[connId];
        conn.send(rd);
    }
    return true;
};

Dispatcher.prototype.dispatchEventDataTarget = function (event,data,targets) {
    var dispatch = new Dispatch(event, data, targets);
    this.dispatch(dispatch);
}

module.exports = Dispatcher;
