var Router = (function () {

    function Router(){
        this.location = null;
        this.root = window.location.origin;
    }

    Router.prototype.bind = function(fn){
        this.handler = fn;
    }

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
            if(link.className.indexOf('handle') === -1){
                console.log('hook placed');
                link.className = link.className.length ? link.className + ' handle' : 'handle'
                link.addEventListener('click',function (e) {
                    e.preventDefault();
                    var pathname = link.pathname.charAt(0) === '/' ? link.pathname : '/' + link.pathname;
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

    Router.prototype.navigate = function(path) {
        console.log('[Router::navigate] called with path as '+path);
        if(path === void 0){
            path = this.getLocation();
        }
        if(this.location == path){
            console.log('[Router::navigate] replace state');
            window.history.replaceState({location: path}, '', this.root + path + window.location.search + window.location.hash);
        }
        else{
            console.log('[Router::navigate] push state');
            this.location = path;
            window.history.pushState({location: path}, '', this.root + path + window.location.search + window.location.hash);
            this.handler.call(null,path);
        }
        this.parseTags();
    };

    Router.prototype.getLocation = function(){
        return decodeURI(window.location.pathname);
    };

    return Router;
}());

module.exports = Router;