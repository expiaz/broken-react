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