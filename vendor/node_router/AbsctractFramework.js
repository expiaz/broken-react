var routerEngine = require('./Router');
var historyEngine = require('./History');
var templateEngine = require('./Chino');
var modelEngine = require('./Flux');
var dataEngine = require('./Dictionnary');
var Component = require('./Component');


var Framework = (function () {

    function Framework(){

        this.constructors = {
            router: routerEngine,
            template: templateEngine,
            history: historyEngine,
            model: modelEngine,
            dico: dataEngine
        };

        this.componentsDictionnary = new this.constructors.dico();
        this.routerEngine = new this.constructors.router(new this.constructors.history());
        this.templateEngine = new this.constructors.template();

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

        var compo = Object.assign(new Component(this.templateEngine,this.routerEngine),component);

        compo.el = document.getElementById(compo.node) || document.getElementsByTagName('body')[0];

        compo.name = compo.node;

        var initialState = Object.assign(compo.initialState(),{template:compo.template});

        compo.flux.init(initialState);

        this.componentsDictionnary.add(compo.node,compo);

        this.templateEngine.register(compo.template,compo.node,compo.state);

        compo.render();

        this.routerEngine.on(compo.route,compo.middleware.bind(compo));

    };

    Framework.prototype.addMiddleware = function(route,handler){
        if(typeof route == "function")
            this.router.use(route);
        else
            this.router.use(route,handler);
    };

    Framework.prototype.launch = function () {
        this.routerEngine.init();
    }

    return Framework;

}());

module.exports = Framework;