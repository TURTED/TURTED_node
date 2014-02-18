var RawData = function (rawData) {
    this.valid = false;
    this.type = "";
    this.data = {};
    this.rawData = rawData;
    this.validate();
}

RawData.prototype.validate = function () {
    this.valid = false;
    var rd = this.rawData;

    //console.log("Verify ", this.rawData);
    if (typeof rd === "undefined") {
        this.reject("Raw data undefined");
        return false;
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
    //console.log("ERROR ", errMsg);
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

module.exports = RawData;