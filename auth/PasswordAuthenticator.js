var logger = require("../models/Logger");
var PasswordAuthenticator = function(password) {
    if (!password) logger.error("No Password in PasswordAuthenticator");
    this.password = password;
};

PasswordAuthenticator.prototype.verify = function(data) {
    if (typeof data === 'object') {
        if (!data.hasOwnProperty("password")) return false;
        return data.password === this.password;
    }
    if (typeof data === 'string') {
        return data === this.password;
    }
    return false;
};

module.exports = PasswordAuthenticator;

