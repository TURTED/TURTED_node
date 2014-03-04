var RawData = require('./RawData');
var Dispatch = require('./Dispatch');

var Dispatcher = function (connHandler) {
    this.ConnectionHandler = connHandler;
    console.log("Dispatcher created");
}

/**
 * Takes a dispatch paket, resolves all recipients and forwards it for delivery
 * @param dispatch
 * @returns {boolean}
 */
Dispatcher.prototype.dispatch = function (dispatch) {
    console.log("Now I'm resolving it!");
    this.ConnectionHandler.resolve(dispatch);

    console.log("Now creating raw data");
    var rd = new RawData().create(dispatch._event,dispatch._payload).encode();

    console.log("Now I'm dispatchin it!");
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
