var model = require('./Flux');

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