var logger = require("../models/Logger");
var PasswordAuthenticator = function(password) {
    if (!password) logger.error("No Password in PasswordAuthenticator");
    this.password = password;
};

PasswordAuthenticator.prototype.verify = function(data) {
    data = data || {};
    if (!data.hasOwnProperty("password")) return false;
    return data.password === this.password;
};

module.exports = PasswordAuthenticator;

