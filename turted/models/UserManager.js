var UserManager = function() {

}

UserManager.prototype.handleIdent = function(data,arg2) {
    console.log("This ",this);
    console.log("Data ", data);
    console.log("arg2",arg2)
}

module.exports = UserManager;