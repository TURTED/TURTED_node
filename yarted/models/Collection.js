var Collection = function() {
    this.items = {};
}

Collection.prototype.add = function(key, val) {
    console.log("Adding ",key,val);
    this.items[key] = val;
}

Collection.prototype.remove = function (key) {
    delete(this.items[key]);
}

Collection.prototype.has = function(key) {
    return (key in this.items);
}

Collection.prototype.length = function() {
    var l = 0;
    for (p in this.items) {
        if (this.items.hasOwnProperty(p)) {
            l++;
        };
    }
    return l;
}

module.exports = Collection;