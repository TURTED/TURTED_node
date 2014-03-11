var logger = require("../models/Logger");
var crypto = require("crypto");

var TokenAuthenticator = function(prefix, suffix, hashType) {
    if (typeof prefix === "undefined") {
        prefix = "";
    }
    if (typeof suffix === "undefined") {
        suffix = "";
    }

    if (typeof hashType==="undefined") {
        hashType = "md5";
    }

    if (prefix+suffix === "") {
        logger.warn("---- CRITICAL ---- no prefix and suffix set for token auth!!!!");
    }

    var knownAlgorithms = ['sha1', 'md5', 'sha256', 'sha512'];
    if (knownAlgorithms.indexOf(hashType)<0) {
        logger.warn("We are using nodes own crypto library, and " + hashType + " is not a known type - so we fall back to md5");
        hashType="md5";
    }

    //this.prefix = prefix;
    //this.suffix = suffix;
    //this.hashType = hashType;

    this.createHash = function(id) {
        var algo = crypto.createHash(hashType);
        algo.update(''+prefix+id+suffix);
        return algo.digest("hex");
    }
}

TokenAuthenticator.prototype.encode = function(id) {
    return this.createHash(id);
}

TokenAuthenticator.prototype.verify = function(id, token) {
    return (token === this.encode(id));
}

module.exports = TokenAuthenticator;