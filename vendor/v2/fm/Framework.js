var Chino = require('./../chino/Chino');
var Router = require('./../router/Router');
var Component = require('./Component');
var ComponentManager = require('./ComponentManager');

var Framework = (function () {

    function Framework(){
        this.templateEngine = new Chino();
        this.routerEngine = new Router();
        this.componentManager = new ComponentManager(this.routerEngine);
    }

    Framework.prototype.createComponent = function (component) {

        var compo = Object.assign(new Component(this.templateEngine),component);

        compo.el = document.getElementById(compo.node) || document.getElementsByTagName('body')[0];

        compo.name = compo.node;

        var initialState = compo.getInitialState() && compo.getInitialState() || {};

        compo.flux.init(initialState);

        compo.state = initialState;

        this.componentManager.add(compo);

    };

    Framework.prototype.launch = function () {
        this.routerEngine.init();
    }

    return Framework;

}());

module.exports = Framework;