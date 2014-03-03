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
    console.log("Now I'm dispatchin it!");
    console.log(dispatch);
    return true;
};

Dispatcher.prototype.dispatchEventDataTarget = function (e,data,targets) {
    var dispatch = new Dispatch(e, data, targets);
    this.dispatch(dispatch);
}

module.exports = Dispatcher;
