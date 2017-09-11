var PasswordAuthenticator = function(password) {
    if (!password) console.error("No Password");
    this.password = password;
};

PasswordAuthenticator.prototype.verify = function(data) {
    data = data || "";
    return data === this.password;
};

module.exports = PasswordAuthenticator;

