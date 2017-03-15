var Router = require('./router/Router');
var History = require('./router/History');
var Chino = require('./Chino');
var Flux = require('./Flux');
var Dictionnary = require('./Dictionnary');
var Component = require('./Component');


var Framework = (function () {

    function Framework(){
        this.componentsDictionnary = new Dictionnary();
        this.routerEngine = new Router(new History());
        this.templateEngine = new Chino();

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

        //this.componentManager.add(compo.node,compo);

        this.componentsDictionnary.add(compo.node,compo);

        this.templateEngine.register(initialState.template || "No template provided in initialState()",compo.node,initialState);
        if(Array.isArray(compo.route)){
            for(var i = 0; i < compo.route; i++)
                this.routerEngine.on(compo.route[i],compo.mountMiddleware.bind(compo));
        }
        else if(typeof compo.route == "string") {
            this.routerEngine.on(compo.route, compo.mountMiddleware.bind(compo));
        }

    };

    Framework.prototype.addMiddleware = function(route,handler){
        if(typeof route == "function")
            this.routerEngine.use(route);
        else
            this.routerEngine.use(route,handler);
    };

    Framework.prototype.launch = function () {
        var self = this;
        this.routerEngine.use(function (url,lastHistory,next) {
            var keys = self.componentsDictionnary.getKeys();
            for(var i = 0; i < keys.length; i++){
                var actualComponent = self.componentsDictionnary.get(keys[i]);
                actualComponent.unmountMiddleware();
            }
            next();
        })
        this.routerEngine.init();
    }

    return Framework;

}());

module.exports = Framework;