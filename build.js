/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var Dictionnary = (function () {

    function Dictionnary(){
        this._keys = [];
        this._values = [];
    }

    Dictionnary.prototype.add = function (key,value) {
        if(typeof key == "object"){
            for(var k in key){
                if(typeof k == "object") {
                    this.add(k);
                }
                else if(this.existsKey(k)){
                    this.set(k,key[k]);
                }
                else{
                    this._keys.push(k);
                    this._values.push(key[k]);
                }
            }
        }
        else if(typeof key == "string" && !!value){
            if(this.existsKey(key)){
                this.set(key,value);
            }
            else{
                this._keys.push(key);
                this._values.push(value);
            }
        }
    }

    Dictionnary.prototype.set = function (key,value) {
        if(typeof key == "object"){
            for(var k in key){
                if(typeof k == "object") {
                    this.set(k);
                }
                else if(!this.existsKey(k)){
                    this.add(k,key[k]);
                }
                else{
                    this._values[this._keys.indexOf(k)] = key[k];
                }
            }
        }
        else if(typeof key == "string" && !!value){
            if(!this.existsKey(key)){
                this.add(key,value);
            }
            else{
                this._values[this._keys.indexOf(key)] = value;
            }
        }
    }

    Dictionnary.prototype.get = function (key) {
        return this._values[this._keys.indexOf(key)] || -1;
    }

    Dictionnary.prototype.duplicate = function (key) {
        var ret = this._values.slice(this._keys.indexOf(key), this._keys.indexOf(key) + 1)[0];
        console.log('[Dico::duplicate] return = ');
        console.log(ret);
        if(typeof ret == "object"){
            if(Array.isArray(ret)){
                return this.utils.map_(ret);
            }
            else{
                return this.utils.assign_(ret);
            }
        }
        return ret;
    }

    Dictionnary.prototype.utils = {
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
        }
    }

    Dictionnary.prototype.remove = function (key) {
        if(this._keys.indexOf(key) == -1) return false;
        var index = this._keys.indexOf(key);
        this._keys.splice(index,1);
        return this._values.splice(index,1);
    }

    Dictionnary.prototype.replace = function (key,value) {
        this._values[this._keys.indexOf(key)] = value;
    }

    Dictionnary.prototype.existsKey = function (key) {
        console.log('[Dico::existskey] of '+key+' in ');
        console.log(JSON.stringify(this._keys));
        return this._keys.indexOf(key) != -1;
    }

    Dictionnary.prototype.existsValue = function (value) {
        return this._values.indexOf(value) != -1;
    }

    Dictionnary.prototype.getKey = function (value) {
        return this._keys[this._values.indexOf(value)];
    }

    Dictionnary.prototype.sort = function (fn) {
        if(fn == void 0){
            fn = function(a, b){
                if(a < b) return -1;
                if(a > b) return 1;
                return 0;
            };
        }
        var oldKeys = {};
        for(var i = 0; i < this._keys.length; i++){
            oldKeys[this._keys[i]] = i;
        }
        var newKeys = this._keys.sort(fn),
            newValues = [];
        for(var i = 0; i < this._keys.length; i++){
            newValues[i] = this._values[oldKeys[newKeys[i]]];
        }
        this._keys = newKeys;
        this._values = newValues;
    }

    Dictionnary.prototype.getKeys = function () {
        return this._keys;
    }

    Dictionnary.prototype[Symbol.iterator] = function () {
        var index = 0,
            data  = this._values;

        return {
            next: function() {
                return { value: data[++index], done: !(index in data) }
            }
        };
    }

    return Dictionnary;

}());

module.exports = Dictionnary;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var Flux = (function () {

    function Flux(){
        this.state = {};
        this.store = [];
        this.last = {};
    }

    Flux.prototype.init = function (initialState) {
        if(Object.keys(initialState).length == 0) return;
        this.state = initialState;
    };

    Flux.prototype.getState = function (prop,value,retrieveWholeState) {
        var whole = retrieveWholeState || false;
        if(typeof prop == "object") {
            for(var p in this.state){
                if(this.stripSlashes(this.state[p]) != prop[p] && this.state[p] != prop[p]){
                    if(whole)
                        return this.utils.assign_(this.state);
                    var ret = {};
                    ret[p] = this.state[p];
                    return this.utils.assign_(ret);
                }
            }
            var chosen = false,
                propsIndices;
            for(var i = 0; i < this.store.length; i++){
                propsIndices = [];
                chosen = true;
                for(var p in this.store[i]){
                    if(this.stripSlashes(this.store[i][p]) != prop[p] && this.store[i][p] != prop[p]){
                        chosen = false;
                        break;
                    }
                    else
                        propsIndices.push(p);
                }
                if(chosen) {
                    if(whole)
                        return this.utils.assign_(this.store[i]);
                    var ret = {};
                    for(var i = 0; i < propsIndices.length; i++)
                        ret[propsIndices[i]] = this.store[i][propsIndices[i]];
                    return this.utils.assign_(ret);
                }
            }
            return -1;
        }
        else if(typeof prop == "string" && !!value) {
            for (var p in this.state){
                if (p == prop && ((this.state[p] == value) || (this.stripSlashes(this.state[p]) == value))){
                    if(whole)
                        return this.utils.assign_(this.state);
                    var ret = {};
                    ret[p] = this.state[p];
                    return this.utils.assign_(ret);
                }
            }
            for (var i = 0; i < this.store.length; i++){
                for (var p in this.store[i]){
                    if (p == prop && ((this.store[i][p] == value) || (this.stripSlashes(this.store[i][p]) == value))){
                        if(whole)
                            return this.utils.assign_(this.store[i]);
                        var ret = {};
                        ret[p] = this.store[i][p];
                        return this.utils.assign_(ret);
                    }
                }
            }
            return -1;
        }
        else if(typeof prop == "string" && value == void 0){
            for (var p in this.state){
                if (p == prop){
                    if(whole)
                        return this.utils.assign_(this.state);
                    var ret = {};
                    ret[p] = this.state[p];
                    return this.utils.assign_(ret);
                }
            }
            for (var i = 0; i < this.store.length; i++) {
                for (var p in this.store[i]) {
                    if (p == prop){
                        if(whole)
                            return this.utils.assign_(this.store[i]);
                        var ret = {};
                        ret[p] = this.state[i][p];
                        return this.utils.assign_(ret);
                    }
                }
            }
        }
        else {
            return this.utils.assign_(this.state);
        }
    };

    Flux.prototype.stripSlashes = function(str){
        return str.replace(/^\//,'').replace(/\/$/,'');
    };

    Flux.prototype.diff = function (a,b) {
        console.log('[Flux::diff] called',arguments);
        if(typeof a != "object")
            a = Object.create(a);
        if(typeof b  != "object")
            b = Object.create(b);
        var a_length = Object.keys(a).length,
            b_length = Object.keys(b).length;
        if(a_length == 0 || b_length == 0) return true;
        //we want to iterate on the more little
        for(var k_a in a)
            if(typeof a[k_a] == "object") a_length+=Object.keys(a[k_a]).length;
        for(var k_b in b)
            if(typeof b[k_b] == "object") b_length+=Object.keys(b[k_b]).length;
        if(a_length > b_length){
            var c = a;
            a = b;
            b = c;
        }
        for(var k in a){
            console.log('[Flux::diff] '+k+' in ',b,(k in b),!(k in b));
            if(!(k in b))
                return true;
            //k is in a and b at the same nesting level
            //need to compare values and sub-structures now
            console.log('[Flux::diff] typeof '+a[k]+' != typeof '+b[k],typeof a[k] != typeof b[k]);
            if(typeof a[k] != typeof b[k])
                return true;
            //compare object / arrays
            console.log('[Flux::diff] typeof '+a[k],typeof a[k]);
            switch(typeof a[k]){
                case "object":
                    console.log('[Flux::diff] goes in object');
                    console.log('[Flux::diff] '+a[k].constructor+' != '+b[k].constructor,a[k].constructor != b[k].constructor);
                    if(a[k].constructor != b[k].constructor)
                        return true;
                    console.log('[Flux::diff] instances ',(a[k] instanceof Date && b[k] instanceof Date) ||
                        (a[k] instanceof RegExp && b[k] instanceof RegExp) ||
                        (a[k] instanceof String && b[k] instanceof String) ||
                        (a[k] instanceof Number && b[k] instanceof Number));

                    if ((a[k] instanceof Date && b[k] instanceof Date) ||
                        (a[k] instanceof RegExp && b[k] instanceof RegExp) ||
                        (a[k] instanceof String && b[k] instanceof String) ||
                        (a[k] instanceof Number && b[k] instanceof Number)) {
                        console.log('[Flux::diff] is one of the bases instances');
                        console.log('[Flux::diff] '+a[k].toString()+' != '+b[k].toString(),a[k].toString() != b[k].toString());
                        if(a[k].toString() != b[k].toString())
                            return true;
                    }
                    console.log('[Flux::diff] '+a[k]+' instanceof Array && '+b[k]+' instanceof Array',a[k] instanceof Array && b[k] instanceof Array);
                    if(a[k] instanceof Array && b[k] instanceof Array){
                        console.log('[Flux::diff] '+a[k].length+' != '+b[k].length,a[k].length != b[k].length);
                        if(a[k].length != b[k].length)
                            return true;
                        for(var i = 0; i < a[k].length; i++){
                            console.log('[Flux::diff] same obj => recursivity this.diff('+a[k]+','+b[k]+')');
                            this.diff(a[k],b[k]);
                        }

                    }
                    //same obj
                    console.log('[Flux::diff] same obj => recursivity this.diff('+a[k]+','+b[k]+')');

                    this.diff(a[k],b[k]);
                    break;
                case "function":
                    console.log('[Flux::diff] goes in function');
                    console.log('[Flux::diff] '+a[k].toString()+' != '+b[k].toString(),a[k].toString() != b[k].toString());
                    if(a[k].toString() != b[k].toString())
                        return true;
                    break;
                case "string":
                    console.log('[Flux::diff] goes in string');
                    console.log('[Flux::diff] '+a[k]+' != '+b[k],a[k] != b[k]);
                    if(a[k] != b[k])
                        return true;
                    break;
                case "number":
                    console.log('[Flux::diff] goes in number');
                    console.log('[Flux::diff] '+a[k]+' != '+b[k],a[k] != b[k]);
                    if(a[k] != b[k])
                        return true;
                    break;
                case "undefined":
                    console.log('[Flux::diff] goes in undefined');
                    break;
            }
        }
        console.log('[Flux::diff] end => return false');
        return false;
    };

    Flux.prototype.setState = function (state) {

        console.log('[Flux::setState] called',arguments);

        if(typeof state != "object" || Array.isArray(state)) return false;


        console.log('[Flux::setState] cmp last/state',this.last,state);

        if(!this.diff(this.last,state)) return false;

        console.log('[Flux::setState] cmp now/state',this.state,state);

        if(!this.diff(this.state,state)) return false;



        this.store.push(this.utils.assign_(this.state));

        this.last = state;

        for(var prop in state) {
            if (typeof state[prop] == "object") {
                if (Array.isArray(state[prop]))
                    this.state[prop] = this.utils.map_(state[prop]);
                else
                    this.state[prop] = this.utils.assign_(state[prop]);
            }
            else
                this.state[prop] = state[prop];
        }

        console.log('[Flux::setState] merged states',this.state);

        return true;

    };

    Flux.prototype.utils = {
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
        }
    };

    return Flux;

}());

module.exports = Flux;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var Router = __webpack_require__(6);
var History = __webpack_require__(5);
var Chino = __webpack_require__(3);
var Flux = __webpack_require__(1);
var Dictionnary = __webpack_require__(0);
var Component = __webpack_require__(4);


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

        var initialState = compo.getInitialState();

        compo.flux.init(initialState);

        //this.componentManager.add(compo.node,compo);

        //this.componentsDictionnary.add(compo.node,compo);

        this.templateEngine.register(initialState.template || "No template provided in initialState()",compo.node,initialState);

        this.routerEngine.on(compo.route,compo.index.bind(compo));

    };

    Framework.prototype.addMiddleware = function(route,handler){
        if(typeof route == "function")
            this.routerEngine.use(route);
        else
            this.routerEngine.use(route,handler);
    };

    Framework.prototype.launch = function () {
        this.routerEngine.init();
    }

    return Framework;

}());

module.exports = Framework;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var Dictionnary = __webpack_require__(0);
var Context = __webpack_require__(7);
var Parser = __webpack_require__(8);
var Precompiler = __webpack_require__(9);
var Render = __webpack_require__(10);

var Chino = (function () {

    function Chino(){
        this._cached = new Dictionnary();
        this.engine = {
            precompiler: new Precompiler(),
            parser: new Parser(),
            context: new Context(),
            render: new Render()
        };
    }

    /**
     * evaluate the validity of expressions in the template
     * @param tpl {string}
     * @returns {boolean}
     */
    Chino.prototype.evaluate = function(tpl){
        var stack = [],
            matches = [],
            termReg = /<%(\w+) *(?:{{(\W)?([^}]+)}})? *(?:(\w+) *{{(\W)?(\w+)}})?%>/gi;

        while (matches = termReg.exec(tpl)){
            stack.length?(matches[1].match(/end/i)?(stack[stack.length-1]==matches[1].replace('end','')?stack.pop():null):stack.push(matches[1])):stack.push(matches[1]);
        }

        return stack.length == 0;
    }

    /**
     * register a template on cache
     * @param tpl
     * @param vars
     * @param name
     * @returns {*}
     */
    Chino.prototype.register = function (tpl,name,vars) {
        if(!tpl || !name)
            throw new Error("Can't register a template without name or content");

        if(!this.evaluate(tpl))
            throw new Error("Fail eval");


        if(typeof vars == "object" && Object.keys(vars).length != 0){
            tpl = this.engine.precompiler.precompile(tpl,vars);
            if(!this.evaluate(tpl))
                throw new Error("Fail precompliation eval");
        }

        tpl = this.engine.parser.parse(tpl);

        this._cached.add(name,tpl);

        return this;
    }

    /**
     * lauch rendering
     * @param tpl
     * @param vars
     * @param name
     * @returns {string|*}
     */
    Chino.prototype.render = function(tpl,vars,name){

        console.log('[chino::render] rendering template ' + JSON.stringify(tpl));

        var template;

        if(!vars)
            vars = {};

        if(typeof vars != "object" || Array.isArray(vars))
            throw new Error('vars aren\'t object type');

        console.log('[chino::render] testing this._cached.existsKey('+JSON.stringify(tpl)+') = ');
        console.log(this._cached.existsKey(tpl));
        if (this._cached.existsKey(tpl)){
            template = this._cached.duplicate(tpl);
        }
        else{
            template = tpl;
            if(!this.evaluate(template))
                throw new Error("Fail eval");
            template = this.engine.precompiler.precompile(template,vars);
            if(!this.evaluate(template))
                throw new Error("Fail precompliation eval");
            template = this.engine.parser.parse(template);
        }

        if(name)
            this._cached.set(name,template);

        console.log('rendering template ' + tpl);
        console.log(JSON.stringify(template));

        template = this.engine.context.contextify(template,vars);
        template = this.engine.render.render(template);

        return template;
    }

    /**
     * display the nodeTree with nesting levels on the console
     * @param tree
     * @param stair
     */
    Chino.prototype.displayNodeTree = function(tree,stair){
        stair = stair || 0;
        var indentation = "\t".repeat(stair);
        console.log(' ');
        console.log(indentation+"***** NODE "+stair+" ******")
        console.log(indentation+tree.expression+(tree.variable ? " {{"+tree.variable+"}}" : ''));
        //console.log(tree.context);
        console.log(indentation +  'content : ' + (tree.content ? tree.content : ''));
        console.log(indentation +  'rendered : ' + (tree.rendered !== undefined ? tree.rendered : ''));
        if(tree.childs)
            for(var n = 0;n<tree.childs.length;n++)
                this.displayNodeTree(tree.childs[n],stair + 1);
    };

    return Chino;

}());

module.exports = Chino;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var model = __webpack_require__(1);

var Component = (function () {
    
    function Component(templateEngine){
        this.node = "app";
        this.route = "/";
        this.template = "";
        this.flux = new model();
        this.tplEngine = templateEngine;
        this.stateChanged = false;
    }

    Component.prototype.getInitialState = function () {
        return {};
    };

    Component.prototype.componentWillMount = function () {

    };

    Component.prototype.componentHaveMount = function () {

    };

    Component.prototype.componentWillUnmount = function () {

    };

    Component.prototype.render = function (now,old) {
        return "<h1>{{location}}</h1>";
    };

    Component.prototype.middleware = function () {
        //this.flux.setState({location:now.url});
        this.componentWillMount();
        this.mount();
        this.componentHaveMount();
    };

    Component.prototype.setState = function(newstate){
        console.log('[Component('+this.node+')::setState] called',arguments);
        if(this.flux.setState(newstate)){
            console.log('[Component('+this.node+')::setState] state modified, re-rendering');
            this.middleware();
        }
    };

    Component.prototype.unmount =  function () {
        this.el.innerHTML = "";
    };

    Component.prototype.mount =  function () {
        var template = this.render();
        if(this.template != template){
            this.template = template;
            this.el.innerHTML = this.tplEngine.render(this.template,this.flux.getState(),this.node);
        }
        else{
            this.el.innerHTML = this.tplEngine.render(this.node,this.flux.getState());
        }
    };

    Component.prototype.index = function (now,old) {

    };

    return Component;
    
}());

module.exports = Component;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

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

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var Router = (function () {

    function Router(history){
        this.routes = {
            always:[],
            stack: []
        };
        this.root = window.location.origin;
        this.middlewares = {
            main: {},
            stack: []
        }
        this.history = history;
    }

    Router.prototype.bind = function (history) {
        this.history = history;
    };

    Router.prototype.init = function () {
        this.parseTags();
        this.listen();
        this.navigate(decodeURI(window.location.pathname));
    };

    Router.prototype.parseTags = function () {
        var self = this;
        console.log('[Router::parseTags]')
        Array.prototype.slice.call(document.getElementsByTagName('a')).forEach(function (link) {
            console.log('link finded ',link);
            if(!(link.className.match(/handle/))){
                link.className = link.className.length ? link.className + ' handle' : 'handle'
                link.addEventListener('click',function (e) {
                    e.preventDefault();
                    var pathname = link.pathname.charAt(0) == '/' ? link.pathname : '/' + link.pathname;
                    self.navigate(pathname);
                });
            }
        });
    };

    Router.prototype.listen = function(){
        var self = this;
        window.onpopstate = function (e) {
            self.navigate(e.state.location);
        };
    };

    Router.prototype.use = function (route,handler) {
        if(arguments.length == 1 && typeof route == "function"){
            this.middlewares.main = {
                name: 'base',
                route: '*',
                vars: [],
                handler: route
            };
            return this;
        }

        var _vars = [];
        this.middlewares.stack.push({
            name: route,
            route: new RegExp('^/' + route.replace(/:(\d+|\w+)/g, function (global, match) {
                    _vars.push(match);
                    return "(.[^\/]*)";
                }) + '$'),
            vars: _vars,
            handler: handler
        });

        this.middlewares.stack = this.middlewares.stack.sort(function (a,b) {
            return b.route.toString().length - a.route.toString().length;
        });

        return this;
    };

    Router.prototype.on = function(route,handler){

        if(typeof route == "function"){
            var alreadyRegistered = false;
            for(var i = 0; i < this.routes.stack.length; i++){
                if(this.routes.stack[i].name == "/"){
                    alreadyRegistered = true;
                    this.routes.stack[i].handler.push(handler);
                }
            }
            if(!alreadyRegistered){
                this.routes.stack.push({
                    name: 'base',
                    route: /\//,
                    vars: [],
                    handler: [route]
                })
            }
            return this;
        }

        if(typeof route != "string")
            return this;

        if(route == "*"){
            this.routes.always.push(handler);
            return this;
        }

        var alreadyRegistered = false;
        for(var i = 0; i < this.routes.stack.length; i++){
            if(this.routes.stack[i].name == route){
                alreadyRegistered = true;
                this.routes.stack[i].handler.push(handler);
            }
        }
        if(!alreadyRegistered){
            var _vars = [];
            this.routes.stack.push({
                name: route,
                route: new RegExp('^' + route.replace(/:(\d+|\w+)/g, function (global, match) {
                        _vars.push(match);
                        return "(.[^\/]*)";
                    }) + '$'),
                vars: _vars,
                handler: [handler]
            });
        }

        this.routes.stack = this.routes.stack.sort(function (a,b) {
            return b.length - a.length;
        });

        return this;
    };

    Router.prototype.navigate = function(route) {
        console.log('[Router::navigate] ('+route+')');
        this.applyMiddleware(route);
    };

    Router.prototype.applyMiddleware = function (route,index) {

        var path = route || this.getLocation(),
            match;

        if(index == void 0){
            this.middlewares.main.name !== undefined
                ? this.middlewares.main.handler.call({},{url:path}, this.history.last(), function(){ this.applyMiddleware(path,0) }.bind(this))
                : this.applyMiddleware(path,0);
            return;
        }


        for(var i = index; i < this.middlewares.stack.length; i++){
            if (match = path.match(this.middlewares.stack[i].route)) {
                match.shift();
                var args = match.slice(),
                    params = {};
                for (var j = 0; j < args.length; j++)
                    params[this.middlewares.stack[i].vars[j]] = args[j];
                this.middlewares.stack[i].handler.call({}, {route: this.middlewares.stack[i].name, url: match.input, params: params}, this.history.now(), function(){ this.applyMiddleware(path,++i) }.bind(this))
                return;
            }
        }

        this.applyRoute(path);
    };

    Router.prototype.applyRoute = function (route) {

        console.log('[Router::applyRoute] (route/registered) ',route,this.routes);

        var path = route || this.getLocation(),
            match;


        for(var i = 0; i < this.routes.stack.length; i++) {
            if (match = path.match(this.routes.stack[i].route)) {
                console.log('[Router::applyRoute] match found (match/route object) ',match,this.routes.stack[i]);
                match.shift();
                var args = match.slice(),
                    params = {};
                for (var j = 0; j < args.length; j++)
                    params[this.routes.stack[i].vars[j]] = args[j];
                if(this.history.now() && this.history.now().url  != match.input){
                    this.history.add({
                        route: this.routes.stack[i].name,
                        url: {
                            real: match.input,
                            display: path
                        },
                        params: params
                    });
                    window.history.pushState({location: path}, '', this.root + path + window.location.search + window.location.hash);
                }
                else{
                    window.history.replaceState({location: path}, '', this.root + path + window.location.search + window.location.hash);
                }
                //this.emit(this.routes.stack[i].name);
                for(var j = 0; j < this.routes.stack[i].handler.length; j++)
                    this.routes.stack[i].handler[j].call(null, this.history.now() || {}, this.history.last() || {});
                this.parseTags();
                return;
            }
        }

        for(var i = 0; i < this.routes.always.length; i++) {
            this.routes.always[i].handler.call(null, this.history.now() || {}, this.history.last() || {});
        }

    };

    Router.prototype.emit = function(route){
        for(var i = 0; i < this.routes.stack.length; i++)
            if(this.routes.stack[i].name == route)
                for(var j = 0; j < this.routes.stack[i].handler.length; j++)
                    this.routes.stack[i].handler[j].call(null, this.history.now(), this.history.last());
        this.parseTags();
    };

    Router.prototype.getLocation = function(){
        return decodeURI(window.location.pathname);
    };

    return Router;
}());

module.exports = Router;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

var Context = (function () {

    function Context(){
        this._stack = [];
        this._context;
        this._vars;
        this._nodeTree;
    }

    /**
     * launch context
     * @param vars
     * @param nodeTree
     */
    Context.prototype.contextify = function(nodeTree,vars){
        this._stack = [vars];
        this._context = vars;
        this._vars = vars;
        this._nodeTree = nodeTree;
        return this.applyContext(this._nodeTree);
    };

    /**
     * browse contexts to find the value of varName
     * @param varName
     * @param stackStair : context level
     * @param locked : stop at first context
     * @returns varName value depending on context
     */
    Context.prototype.getContext = function(varName,stackStair,locked){
        stackStair = stackStair || 1;
        console.log('[Context::getContext'+(locked ? '(locked)' : "")+'] of '+varName+' in stackStair '+stackStair,this._stack[this._stack.length - stackStair]);
        //console.log(this._stack[this._stack.length - stackStair]);
        var v = this._stack[this._stack.length - stackStair] || -1,
            t = varName.split('.');
        if(v == -1) return undefined;
        for(var i =0; i<t.length; i++){
            v = v[t[i]];
            if(v == undefined){
                if(locked) return v;
                return this.getContext(varName,++stackStair);
            }
        }
        console.log('[Context::getContext] context of '+varName+ ' = ');
        console.log(v);
        return v;
    };

    /**
     * browse a nodeTree recursively and apply context of variables inside depending on the level of nesting
     * @param node
     * @returns nodeTree
     */
    Context.prototype.applyContext = function (node) {
        this._context = this._stack[this._stack.length -1] || {};
        if(node.type == 'PLAIN'){
            node.context = this._context;
            node.rendered = this.replace(node.content);
            return node;
        }
        else if(node.type == 'NODE'){
            if(node.childs.length){
                if(node.expression == 'if'){
                    var pushContext = true, contextPushed = false;
                    if(node.symbol){
                        switch(node.symbol){
                            case '!':
                                node.variable = !this.getContext(node.variable);
                                break;
                            case '&':
                                node.variable = this.getContext(node.variable,1,true);
                                break;
                            case ':':
                                node.variable = this.getContext(node.variable);
                                pushContext = false;
                                break;
                            default:
                                node.variable = this.getContext(node.variable);
                        }
                    }
                    else node.variable = this.getContext(node.variable,1);
                    if(node.variable){
                        node.rendered = true;
                        if(typeof node.variable == "object" && !Array.isArray(node.variable) && pushContext){
                            this._stack.push(node.variable);
                            node.context = node.variable;
                            contextPushed = true;
                        }
                        for(var i =0; i < node.childs.length; i++){
                            node.childs[i] = this.applyContext(node.childs[i]);
                        }
                        if(contextPushed) this._stack.pop();
                    }
                    else{
                        node.rendered = false;
                        node.context = this._context;
                    }
                    return node;
                }
                else if(node.expression == 'for'){
                    var currContext, dupChild;
                    node.iterateChilds = node.childs;
                    node.childs = [];
                    if(!isNaN(parseInt(node.variable))){
                        node.variable = parseInt(node.variable);
                    }
                    else if(node.symbol){
                        switch(node.symbol){
                            case '&':
                                node.variable = this.getContext(node.variable,1,true);
                                break;
                            default:
                                node.variable = this.getContext(node.variable);
                                break;
                        }
                    }
                    else node.variable = this.getContext(node.variable);
                    if(typeof node.variable == "object" && Array.isArray(node.variable)){
                        for(var i = 0; i < node.variable.length; i++){
                            currContext = {};
                            currContext[node.subvariable] = node.variable[i];
                            this._stack.push(currContext);
                            for(var j =0; j < node.iterateChilds.length; j++){
                                dupChild = {};
                                for(var k in node.iterateChilds[j])
                                    dupChild[k] = node.iterateChilds[j][k];
                                node.childs.push(this.applyContext(dupChild));
                            }
                            this._stack.pop();
                        }
                        node.context = node.variable;
                        node.rendered = true;
                    }
                    else if(!isNaN(parseInt(node.variable))){
                        node.variable = parseInt(node.variable);
                        for(var i = 0; i < node.variable; i++){
                            currContext = {};
                            currContext[node.subvariable] = i;
                            this._stack.push(currContext);
                            for(var j =0; j < node.iterateChilds.length; j++){
                                dupChild = {};
                                for(var k in node.iterateChilds[j])
                                    dupChild[k] = node.iterateChilds[j][k];
                                node.childs.push(this.applyContext(dupChild));
                            }
                            this._stack.pop();
                        }
                        node.context = node.variable;
                        node.rendered = true;
                    }
                    else {
                        node.rendered = false;
                        node.context = this._context;
                    }
                }
            }
            else{
                node.rendered = false;
            }
            return node;
        }
        else if(node.type == 'ROOT'){
            node.context = this._context;
            if(node.childs.length){
                for(var i =0; i < node.childs.length; i++){
                    node.childs[i] = this.applyContext(node.childs[i]);
                }
            }
            return node;
        }
    };

    /**
     * replace variables on a string (tpl) depending on symbols and contexts
     * @param tpl
     * @returns tpl
     */
    Context.prototype.replace = function (tpl) {
        if(tpl == '\r\n' || tpl == '\n\r') return '';

        var match = [],
            reg = /{{(\W)?([^{]+)}}/g,
            ret = tpl;

        while(match = reg.exec(tpl)){

            var symbol = match[1],
                m = match[2],
                ctx;

            if(symbol){
                switch(symbol){
                    case '!':
                        ctx = !this.getContext(m);
                        break;
                    case '&':
                        ctx = this.getContext(m,1,true);
                        break;
                    default:
                        ctx = this.getContext(m);
                        break;
                }
            }
            else ctx = this.getContext(m);

            ret = ret.replace(match[0],ctx !== undefined && typeof ctx !== "object" ? ctx : '');
        }

        return ret;
    };

    return Context;

}());

module.exports = Context;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

var Parser = (function () {

    function Parser(){
        this._stack = [];
        this.cursor = {
            lastpos:0,
            currpos:0
        };
        this._tpl;
    }

    /**
     * launch parsing
     * @param tpl
     * @param vars
     */
    Parser.prototype.parse = function(tpl){
        this._stack = [];
        this.cursor = {
            lastpos:0,
            currpos:0
        };
        this._tpl = tpl;
        return this.getExpressionTree();
    };

    /**
     * @class IfNode
     * @param raw
     * @constructor
     */
    Parser.prototype.IfNode = function(raw){
        this.type = 'OPENING';
        this.expression = 'if';
        this.childs = [];
        //this.content = '';
        this.rendered = '';
        this.context = {};

        this.variable = raw.variable;
        this.symbol = raw.symbol;
        this.tags = [raw.tag];
        this.indexs = [raw.index];
    };

    /**
     * @class ForNode
     * @param raw
     * @constructor
     */
    Parser.prototype.ForNode = function(raw){
        this.type = 'OPENING';
        this.expression = 'for';
        this.childs = [];
        this.iterateChilds = [];
        //this.content = '';
        this.rendered = '';
        this.context = {};
        this.symbol = raw.symbol;
        this.variable = raw.variable;
        this.subvariable = raw.subvariable || 'i';
        this.subsymbol = raw.subsymbol;
        this.keyword = raw.keyword;
        this.tags = [raw.tag];
        this.indexs = [raw.index];
    };

    /**
     * @class TextNode
     * @param raw
     * @constructor
     */
    Parser.prototype.TextNode = function(raw){
        this.type = 'PLAIN';
        this.expression = 'text';
        this.content = raw.content;
        this.rendered = '';
        this.context = {};

        this.variables = [];
        this.indexs = raw.indexs;
    };

    /**
     * @class RootNode
     * @constructor
     */
    Parser.prototype.RootNode = function(){
        this.type = 'ROOT';
        this.expression = 'root';
        this.childs = [];
        this.context = {};
    };

    /**
     * @class represents any of </> tag
     * @param raw
     * @constructor
     */
    Parser.prototype.ClosingTagNode = function(raw){
        this.type = 'CLOSING';
        this.expression = raw.expression.replace('end','');
        this.tag = raw.tag;
        this.indexs = [raw.index,raw.index+raw.tag.length];
    };

    /**
     * return a nodeObject depending on raw infos
     * @param raw
     * @param type
     * @returns node
     */
    Parser.prototype.getNode = function(raw,type){
        switch(type || raw.expression){
            case 'if':
                return new this.IfNode(raw);
                break;
            case 'for':
                return new this.ForNode(raw);
                break;
            case 'text':
                return new this.TextNode(raw);
                break;
            case 'root':
                return new this.RootNode();
                break;
            case 'endif':
            case 'endfor':
                return new this.ClosingTagNode(raw);
                break;
        }
    };

    /**
     * push a text node to the nodeTree depending on the positions of the cursor
     */
    Parser.prototype.pushTextNode = function(){
        var raw_text_node = {};
        raw_text_node.expression = 'text';
        raw_text_node.indexs = [this.cursor.lastpos, this.cursor.currpos];
        raw_text_node.content = this._tpl.substring(this.cursor.lastpos,this.cursor.currpos);
        this._stack[this._stack.length-1].childs.push(this.getNode(raw_text_node));
    };

    /**
     * push an entiere node to the nodeTree by assembling opening and closing nodes
     * @param closingNode
     */
    Parser.prototype.pushExpressionNode = function(closingNode){
        var openingNode = this._stack.pop();
        if(openingNode.expression != closingNode.expression) return;
        openingNode.type = 'NODE';
        openingNode.tags.push(closingNode.tag);
        openingNode.indexs.push(closingNode.indexs[1]);
        this._stack[this._stack.length-1].childs.push(openingNode);
    };

    /**
     * reformate the match result into an object
     * @param match
     * @returns {{tag: *, index: (*|Number), expression: string, symbol: *, variable: *, keyword: *, subsymbol: *, subvariable: *}}
     */
    Parser.prototype.reformate = function(match){
        return {
            tag: match[0],
            index: match.index,
            expression: match[1].toLowerCase(),
            symbol: match[2],
            variable: match[3],
            keyword: match[4],
            subsymbol:match[5],
            subvariable: match[6]
        };
    };

    /**
     * return a tree of expressions and text nodes from a template
     * @returns nodeTree
     */
    Parser.prototype.getExpressionTree = function(){
        this._stack.push(this.getNode(null,'root'));
        var match, current_node,
            reg = /<%(\w+) *(?:{{(\W)?([^}]+)}})? *(?:(\w+) *{{(\W)?(\w+)}})?%>/g;

        while(match = reg.exec(this._tpl)){
            match = this.reformate(match);
            this.cursor.currpos = match.index;
            current_node = this.getNode(match);
            if(this.cursor.currpos > this.cursor.lastpos) this.pushTextNode();
            if(current_node.type == 'OPENING') this._stack.push(current_node);
            else this.pushExpressionNode(current_node);
            this.cursor.lastpos = this.cursor.currpos + (current_node.type == 'OPENING' ? current_node.tags[0].length : current_node.tag.length);
        }

        if(this.cursor.lastpos == this._tpl.length) return this._stack.pop();

        this.cursor.currpos = this._tpl.length;
        this.pushTextNode();
        return this._stack.pop();
    };

    return Parser;

}());

module.exports = Parser;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

var Precompiler = (function () {

    function Precompiler(){
        this._tpl;
        this._vars;
    }

    /**
     * launch precompilation
     * @param tpl
     * @param vars
     * @returns new template
     */
    Precompiler.prototype.precompile = function(tpl,vars){
        this._tpl = tpl;
        this._vars = vars;
        this.makeInjections();

        return this._tpl;
    };

    /**
     * replace {{>*}} tags by their content
     */
    Precompiler.prototype.makeInjections = function(){
        var reg = /{{>(\w+)}}/,
            match = [];

        while(match = reg.exec(this._tpl)){
            var v = this._vars,
                t = match[1].split('.');
            for(var i =0; i<t.length; i++)
                v = v[t[i]];
            this._tpl.replace(match[0],v ? v : '');
        }
    };

    return Precompiler;

}());

module.exports = Precompiler;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

var Render = (function () {

    /**
     * @class renderEngine
     */
    function Render(){
        this._nodeTree;
    }

    /**
     * launch rendering
     * @param nodeTree
     * @return {string} template rendered
     */
    Render.prototype.render = function(nodeTree){
        this._nodeTree = nodeTree;
        return this.renderNode(nodeTree);
    };

    /**
     * browse a nodeTree recurively and assemble text nodes together to make the template
     * @param node
     * @returns {string} template rendered
     */
    Render.prototype.renderNode = function(node){
        var ret = '';
        for(var i = 0; i < node.childs.length; i++){
            if(node.childs[i].type == 'NODE'){
                if(node.childs[i].expression == 'if' || node.childs[i].expression == 'for')
                    if(node.childs[i].rendered)
                        ret += this.renderNode(node.childs[i]);
            }
            else if(node.childs[i].type == 'PLAIN'){
                ret += this.trimText(node.childs[i].rendered);
            }
        }
        return ret;
    };

    /**
     *
     * @param text
     * @returns {tpl|void|XML|string}
     */
    Render.prototype.trimText = function(text){
        return text.replace(/^[\r\n]+|[\r\n]+$/g,'');
    };

    return Render;

}());

module.exports = Render;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var framework = __webpack_require__(2);

var react = new framework();

react.createComponent({
    node:"app",
    route: "/",
    getInitialState: function(){
        return {
            message: "greeting",
            template: '<h1>{{message}} from {{location}} <a href="product/4">go to product</a><%if {{node}}%><br/>You are at {{node}}<%endif%></h1>'
        };
    },
    index: function (now,old) {
        this.setState({location:now.url.display,node:this.node});
    },
    render: function () {
        console.log('[App Component::render]',arguments);
        return '<h1>{{message}} from {{location}} <a href="/product/4">go to product</a><%if {{node}}%><br/>You are at {{node}}<%endif%></h1>';
    }
});

react.createComponent({
    node:"product",
    route: "/product/:id",
    getInitialState: function (actualLocation,lastLocation) {
        return {
            template: '<h1>product {{id}}</h1>',
            click: 0
        }
    },
    index: function(now,old){
        this.setState({id:now.params.id});
        console.log('[App product::index]',arguments);
    },
    componentWillMount: function(){
        console.log('PRODUCT WILL RENDER');
    },
    componentHaveMount: function () {
        this.handleClick();
    },
    render: function () {
        return '<h1>product {{id}} : {{click}}</h1>';
    },
    handleClick: function () {
        var self = this;
        this.el.firstChild.addEventListener('click', function () {
            self.setState({click:self.flux.getState('click').click + 1});
        })
    }
});

react.launch();

react.routerEngine.navigate("/");

/***/ })
/******/ ]);