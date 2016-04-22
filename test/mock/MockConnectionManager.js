var MockConnectionManager = function() {
};

MockConnectionManager.prototype.addConnection = function(con) {
    this.lastConnection = con;
};

module.exports = MockConnectionManager;
