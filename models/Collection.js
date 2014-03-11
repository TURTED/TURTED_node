var logger = require("./logger");
var Collection = function() {
    this._items = {};
}

Collection.prototype.add = function(key, val) {
    this._items[key] = val;
}

Collection.prototype.remove = function (key) {
    delete(this._items[key]);
}

Collection.prototype.has = function(key) {
    return (key in this._items);
}
Collection.prototype.exists = Collection.prototype.has;

Collection.prototype.length = function() {
    var l = 0;
    for (p in this._items) {
        if (this._items.hasOwnProperty(p)) {
            l++;
        };
    }
    return l;
}

Collection.prototype.isEmpty = function () {
    return (this.count() ===0);
}


Collection.prototype.count = Collection.prototype.length;

Collection.prototype.get = function(key) {
    if (key in this._items) {
        return this._items[key];
    }
}

Collection.prototype.getItems = function() {
    return this._items;
}



module.exports = Collection;