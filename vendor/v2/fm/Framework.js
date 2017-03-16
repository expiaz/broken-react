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

    Framework.prototype.utils = {
        duplicate_: function(e){
            return typeof e == "object" ? Array.isArray(e) ? this.map_(e) : this.assign_(e) : e;
        },
        assign_: function (obj) {
            var dup = {};
            for(var k in obj){
                dup[k] = typeof obj[k] == "object" ? Array.isArray(obj[k]) ? this.map_(obj[k]) : this.assign_(obj[k]) : obj[k];
            }
            return dup;
        },
        map_: function (arr) {
            var dup = [];
            for(var i = 0; i < arr.length; i++){
                dup[i] = typeof arr[i] == "object" ? Array.isArray(arr[i]) ? this.map_(arr[i]) : this.assign_(arr[i]) : arr[i]
            }
            return dup;
        },
        extend_ : function (a,b){
            var c = {};
            for(var k in a){
                if(a.hasOwnProperty(k)) {
                    c[k] = {
                        value: this.duplicate_(a[k]),
                        writable: true,
                        enumerable: true,
                        configurable: true
                    };
                }
            }
            var d =  Object.create(b,c);
            return d;
        }
    };

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