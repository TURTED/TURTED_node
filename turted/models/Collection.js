var Collection = function() {
    this.items = {};
}

Collection.prototype.add = function(key, val) {
    this.items[key] = val;
}

Collection.prototype.remove = function (key) {
    delete(this.items[key]);
}

Collection.prototype.has = function(key) {
    return (key in this.items);
}
Collection.prototype.exists = Collection.prototype.has;

Collection.prototype.length = function() {
    var l = 0;
    for (p in this.items) {
        if (this.items.hasOwnProperty(p)) {
            l++;
        };
    }
    return l;
}

Collection.prototype.count = Collection.prototype.length;

Collection.prototype.get = function(key) {
    if (key in this.items) {
        return this.items[key];
    }
}

module.exports = Collection;