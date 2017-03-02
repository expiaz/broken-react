var model = require('./Flux');

var Component = (function () {
    
    function Component(templateEngine, routerEngine){
        this.node = "app";
        this.route = "/";
        this.template = "<h1>{{location}}</h1>";
        this.flux = new model();
        this.tplEngine = templateEngine;
        this.rtEngine = routerEngine;
    }

    Component.prototype.initialState = function () {
        return {};
    }

    Component.prototype.index = function (now,old) {
        this.render();
    };

    Component.prototype.middleware = function (now,old) {
        //this.flux.setState({location:now.url});
        this.index(old,now);
    };

    Component.prototype.setState = function(newstate){
        console.log('[Component('+this.node+')::setState] called',arguments);
        if(this.flux.setState(newstate)){
            console.log('[Component('+this.node+')::setState] state modified, re-rendering');
            this.render();
        }
    };

    Component.prototype.render =  function () {
        console.log('[Component::render] rendering of ' + JSON.stringify(this.node));
        var actual = this.flux.getState();
        console.log(JSON.stringify(actual));
        if(actual.template != void 0){
            if(this.template == actual.template){
                var content = this.tplEngine.render(this.node,actual);
                console.log('[Component::render] content rendered = ');
                console.log(JSON.stringify(content));
                this.el.innerHTML = content;
            }
            else{
                this.el.innerHTML = this.tplEngine.render(actual.template,actual,this.node);
                this.template = actual.template;
            }
        }
        else{
            this.el.innerHTML = this.tplEngine.render(this.node,actual);
        }
        this.rtEngine.parseTags();
    };

    return Component;
    
}());

module.exports = Component;