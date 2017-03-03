var Dictionnary = require('./Dictionnary');

var componentManager = (function () {

    function componentManager(){
        this.components = new Dictionnary();
    }

    componentManager.prototype.add = function (name,compo) {
        this.components.add(name,compo);
    };

    componentManager.prototype.renderPage = function (name,compo) {
        var compos = this.components.getKeys();
        for(var i = 0; i < compos.length; i++){

        }
    };

    return componentManager;

}());

module.exports = componentManager;