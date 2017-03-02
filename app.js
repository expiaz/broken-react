var framework = require('./vendor/node_router/AbsctractFramework');

var react = new framework();

react.createComponent({
    node:"bonjour",
    route: "*",
    template: 'bonjour',
    index: function(now,old){
        console.log('[Bonjour Component::index]',arguments);
        console.log('[Bonjour Component flux]',JSON.stringify(this.flux.getState()));
    }
});

react.createComponent({
    node:"app",
    route: "/",
    initialState: function(){
        return {message: "greeting"};
    },
    template: '<h1>{{message}} from {{location}} <a href="/">refresh</a><%if {{node}}%><br/>You are at {{node}}<%endif%></h1>',
    index: function(now,old){
        this.setState({location:now.url.display,node:this.node});
        console.log('[App Component::index]',arguments);
        console.log('[App Component flux]',JSON.stringify(this.flux.getState()));
    }
});

react.createComponent({
    node: "sidebar",
    route: "*",
    initialState: function() {
        var self = this;
        return {
            handler: self.handleClick.bind(self),
            articles: [
                {
                    name: 'pub1',
                    content: 'c\'est bien',
                    image: 'a.jpg'
                }
            ]
        };
    },
    template: '<aside><%for {{articles}} as {{article}}%><div style="background-image:url(\'{{article.image}}\')"><h4>{{article.name}}</h4><p>{{article.content}}<button onclick="{{handler}}">Go to</button></p></div><%endfor%></aside>',
    index: function (now, old) {
        console.log('[Sidebar Component::index]',arguments);
        console.log('[Sidebar Component flux]',JSON.stringify(this.flux.getState()));
        var state = this.flux.getState();
        state.articles.push({
            name:'pub2',
            content:'c\'est mauvais',
            image:'c.jpg'
        });
        this.setState(state);
    },
    handleClick: function (e) {
        console.log(e);
    }
});

react.launch();