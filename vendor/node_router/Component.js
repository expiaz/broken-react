var model = require('./Flux');

var Component = (function () {
    
    function Component(templateEngine){
        this.node = "app";
        this.route = "/";
        this.template = "";
        this.flux = new model();
        this.tplEngine = templateEngine;
        this.state = {};
        this.mounted = false;
    }

    Component.prototype.getInitialState = function () {
        return {};
    };

    Component.prototype.componentWillMount = function () {

    };

    Component.prototype.componentDidMount = function () {

    };

    Component.prototype.componentShouldUpdate = function (lastState,nextState) {
        return true;
    };

    Component.prototype.componentWillUpdate = function () {
    };

    Component.prototype.componentDidUpdate = function () {

    };

    Component.prototype.componentWillUnmount = function () {

    };

    Component.prototype.componentDidUnmount = function () {

    };

    Component.prototype.render = function () {
        return "<h1>{{location}}</h1>";
    };

    Component.prototype.mountMiddleware = function (now,old) {
        //this.flux.setState({location:now.url});
        if(this.mounted == true)
            return;
        this.componentWillMount();
        this.mount();
        this.componentDidMount();
        this.index(now,old);
    };

    Component.prototype.updateMiddleware = function (newState) {
        //this.flux.setState({location:now.url});
        if(this.flux.setState(newState)){
            var nextState = this.flux.getState();
        }
        else{
            return;
        }
        if(this.componentShouldUpdate(this.state,nextState) == false) {
            return;
        }
        this.state = nextState;
        this.componentWillUpdate();
        this.update();
        this.componentDidUpdate();
    };

    Component.prototype.unmountMiddleware = function () {
        //this.flux.setState({location:now.url});
        if(this.mounted == false)
            return;
        this.componentWillUnmount();
        this.unmount();
        this.componentDidUnmount();
    };

    Component.prototype.setState = function(newState){
        this.updateMiddleware(newState);
    };

    Component.prototype.unmount =  function () {
        this.el.innerHTML = "";
        this.mounted = false;
    };

    Component.prototype.mount =  function () {
        this.mounted = true;
        this.update();
    };

    Component.prototype.update = function () {
        var template = this.render();
        if(this.template != template){
            this.template = template;
            this.el.innerHTML = this.tplEngine.render(this.template,this.state,this.node);
        }
        else{
            this.el.innerHTML = this.tplEngine.render(this.node,this.state);
        }
    }


    Component.prototype.index = function (now,old) {

    };

    return Component;
    
}());

module.exports = Component;