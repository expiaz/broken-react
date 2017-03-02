var History = (function () {

    function History(){
        this.history = [];
    }

    History.prototype.add = function (entry) {
        this.history.push(entry);
    };

    History.prototype.now = function () {
        return this.history[this.history.length - 1] || {};
    };

    History.prototype.last = function () {
        return this.history[this.history.length - 2] || {};
    };

    return History;

}());

module.exports = History;