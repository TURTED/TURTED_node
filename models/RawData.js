var logger = require("./Logger");
var RawData = function (rawData) {
    this.valid = false;
    this.type = "";
    this.data = {};
    //if data was passed, verify it
    if (typeof rawData !=="undefined") {
        this.rawData = rawData;
        this.validate();
    }
}

RawData.prototype.validate = function () {
    this.valid = false;
    var rd = this.rawData;

    logger.debug("Verify ", this.rawData);
    if (typeof rd === "undefined") {
        this.reject("Raw data undefined");
        return false;
    }

    if (typeof rd === "string") {
        try {
            var o = JSON.parse(rd);
            if (typeof o === "object") {
                rd = o;
            }
        } catch (ex) {
            logger.error(ex);
        }
    }

    if (typeof rd !== "object") {
        this.reject("Raw data was not an object");
        return false;
    }

    if (!(rd.hasOwnProperty("type"))) {
        this.reject("Raw data has no type given");
        return false;
    }

    //payload "data" is optional, no need to enforce/validate it

    this.type = rd.type;
    this.data = {};
    if (rd.hasOwnProperty("data")) {
        this.data = rd.data;
    }

    //if we come here, it is fine
    this.valid = true;
}

RawData.prototype.reject = function (errMsg) {
    logger.error("ERROR ", errMsg);
    this.valid = false;
    this.error = errMsg;
}

RawData.prototype.isValid = function () {
    return this.valid;
}

RawData.prototype.getType = function () {
    if (this.isValid()) {
        return this.type;
    } else {
        throw "Rawdata invalid";
    }
}

RawData.prototype.getData = function () {
    if (this.isValid()) {
        return this.data;
    } else {
        throw "Rawdata invalid";
    }
}

RawData.prototype.create = function (type, data) {
    this.type = type;
    this.data = data;
    return this;
}

RawData.prototype.encode = function () {
    return JSON.stringify(this.toPlainObject());
}

RawData.prototype.toPlainObject = function () {
    return {
        type: this.type,
        data: this.data
    };
}

module.exports = RawData;