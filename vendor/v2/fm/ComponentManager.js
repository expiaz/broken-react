var Dictionnary = require('./../utils/Dictionnary');
var History = require('./../router/History');

var ComponentManager = (function () {

    function ComponentManager(router) {
        this.components = new Dictionnary();
        this.history = new History();
        this.routes = {
            always:[],
            stack: []
        };
        router.bind(this.render.bind(this));
    }

    ComponentManager.prototype.addComponentToRoute = function(component){

        if(typeof component.route == "string")
            component.route = [component.route];

        for(var i = 0; i < component.route.length; i++){
            this.registerToRoute(component.route[i],component);
        }
    };

    ComponentManager.prototype.registerToRoute = function (route,component){
        if(route == "*"){
            this.routes.always.push(component);
            return;
        }

        var alreadyRegistered = false;
        for(var i = 0; i < this.routes.stack.length; i++){
            if(this.routes.stack[i].name == route){
                alreadyRegistered = true;
                this.routes.stack[i].handlers.push(component);
            }
        }
        if(!alreadyRegistered){
            var _vars = [];
            this.routes.stack.push({
                name: route,
                route: new RegExp('^' + (route.charAt(0) === '/' ? '' : '/') + route.replace(/:(\d+|\w+)/g, function (global, match) {
                        _vars.push(match);
                        return "(.[^\/]*)";
                    }) + '$'),
                vars: _vars,
                handlers: [component]
            });
        }

        this.routes.stack = this.routes.stack.sort(function (a,b) {
            return b.name.length - a.name.length;
        });

    }

    ComponentManager.prototype.add = function (component) {
        this.components.add(component.node,component);
        this.addComponentToRoute(component);
    }


    ComponentManager.prototype.applyRoute = function (path) {

        var match,
            keys = this.components.getKeys();

        for(var i = 0; i < keys.length; i++){
            this.components.get(keys[i]).hasProced = false;
        }


        for(var i = 0; i < this.routes.stack.length; i++) {
            console.log('[ComponentManager::applyRoute] iterating on routes : actual = '+ this.routes.stack[i].route);
            if (match = path.match(this.routes.stack[i].route)) {
                console.log('[ComponentManager::applyRoute] route matched ('+ JSON.stringify(match) +' ) ');

                match.shift();
                var args = match.slice(),
                    params = {};
                for (var j = 0; j < args.length; j++)
                    params[this.routes.stack[i].vars[j]] = args[j];

                //add history entry
                this.history.add({
                    location:{
                        route: this.routes.stack[i].name,
                        url: {
                            real: match.input,
                            display: path
                        },
                        params: params
                    }
                });

                //components who registered as * routes
                for(var i = 0; i < this.routes.always.length; i++) {
                    if(this.routes.always[i].hasProced === false){
                        this.routes.always[i].hasProced = true;
                        if(this.routes.always[i].mounted === false){
                            this.routes.always[i].mountMiddleware();
                            this.routes.always[i].index(this.history.now());
                        }
                        else{
                            this.routes.always[i].index(this.history.now());
                        }
                    }
                }

                //components who subscribed for this route
                for(var j = 0; j < this.routes.stack[i].handlers.length; j++) {
                    if(this.routes.stack[i].handlers[j].hasProced === false){
                        this.routes.stack[i].handlers[j].hasProced = true;
                        if(this.routes.stack[i].handlers[j].mounted === false){
                            this.routes.stack[i].handlers[j].mountMiddleware();
                            this.routes.stack[i].handlers[j].index(this.history.now());
                        }
                        else{
                            this.routes.stack[i].handlers[j].index(this.history.now());
                        }
                    }
                }


                //unmount others
                var c;
                for(var i = 0; i < keys.length; i++){
                    c = this.components.get(keys[i]);
                    if(c.hasProced === false){
                        c.unmountMiddleware();
                    }
                }


                return;
            }
        }


        console.log('[ComponentManager::applyRoute] after applying routes',this.components);

        this.history.add({
            location:{
                url: {
                    display: path
                }
            }
        });

        for(var i = 0; i < this.routes.always.length; i++) {
            if(this.routes.always[i].hasProced === false){
                this.routes.always[i].hasProced = true;
                if(this.routes.always[i].mounted === false){
                    this.routes.always[i].mountMiddleware();
                    this.routes.always[i].index(this.history.now());
                }
                else{
                    this.routes.always[i].index(this.history.now());
                }
            }
        }

        //unmount others
        var c;
        for(var i = 0; i < keys.length; i++){
            c = this.components.get(keys[i]);
            if(c.hasProced === false){
                c.unmountMiddleware();
            }
        }


    };

    ComponentManager.prototype.render = function (path) {
        this.applyRoute(path);
    }

    return ComponentManager;

}());

module.exports = ComponentManager;