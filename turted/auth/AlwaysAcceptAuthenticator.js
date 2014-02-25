var AlwaysAcceptAuthenticator = function() {
}

AlwaysAcceptAuthenticator.prototype.verify = function() {
    return true;
}

module.exports = AlwaysAcceptAuthenticator;