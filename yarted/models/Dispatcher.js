var Dispatcher = function () {
    console.log("Dispatcher created");
}

Dispatcher.prototype.dispatch = function (dispatch) {
    console.log("Now I'm dispatchin it!");
    console.log(dispatch);
};

module.exports = Dispatcher;
