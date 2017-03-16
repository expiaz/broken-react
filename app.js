var framework = require('./vendor/v2/fm/Framework');

var react = new framework();

react.createComponent({
    node:"app",
    route: ["/","app"],
    getInitialState: function(){
        return {
            message: "greeting",
            url: ''
        };
    },
    index: function (now) {
        this.setState({url:now.location.url.display});
    },
    render: function () {
        return '<h1>{{message}} from {{url}}</h1>';
    }
});

react.createComponent({
    node:"navigate",
    route:"*",
    getInitialState: function(){
        return {
            routes:[
                '/app',
                '/node',
                '/bin/bash'
            ],
            actual:0
        };
    },
    index: function (now) {
        this.setState({actual:now.location.url.display});
    },
    render: function () {
        return '<span>You are at {{actual}}</span><ul><%for {{routes}} as {{route}}%><li><a href="{{route}}">{{route}}</a></li><%endfor%></ul>';
    }
})

react.routerEngine.navigate("/");

react.launch();

