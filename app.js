var framework = require('./vendor/node_router/AbsctractFramework');

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