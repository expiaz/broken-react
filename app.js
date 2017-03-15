var framework = require('./vendor/node_router/AbsctractFramework');

var react = new framework();

react.createComponent({
    node:"app",
    route: "*",
    getInitialState: function(){
        return {
            message: "greeting",
            url:'void',
            template: '<h1>{{message}} to {{url}}</h1>'
        };
    },
    index: function (now,old) {
        console.log(now,old);
        this.setState({url:now.location.url.display});
    },
    render: function () {
        console.log('[App Component::render]',arguments);
        return '<h1>{{message}} to {{url}}</h1>';
    }
});

react.launch();

react.routerEngine.navigate("/");