var Dispatch = require('./Dispatch');

var Dispatcher = function (connMan) {
    this.ConnectionManager = connMan;
    console.log("Dispatcher created");
}

Dispatcher.prototype.dispatch = function (dispatch) {
    console.log("Now I'm dispatchin it!");
    console.log(dispatch);
    return true;
};

Dispatcher.prototype.dispatchEventDataTarget = function (e,data,targets) {
    var dispatch = new Dispatch(e, data, targets);
    this.dispatch(dispatch);
}

module.exports = Dispatcher;
