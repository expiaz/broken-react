var Flux = (function () {

    function Flux(){
        this.state = {};
        this.store = [];
        this.lastMaj = {};
    }

    Flux.prototype.init = function (initialState) {
        if(typeof initialState != "object" && Object.keys(initialState).length == 0) return;
        this.state = initialState;
    };

    Flux.prototype.getState = function () {
        return Object.assign({},this.state);
    };

    Flux.prototype.stripSlashes = function(str){
        return str.replace(/^\//,'').replace(/\/$/,'');
    };

    Flux.prototype.diff =  function (a,b,level) {

        var nesting = 0;

        console.log('\t'.repeat(nesting) + '[Flux::diff] invoked with',arguments);

        if(level === void 0)
            level = 1;

        //compare a,b
        if(typeof a != typeof b)
            return true;

        switch(typeof a){
            case "object":
                console.log('\t'.repeat(nesting) + '[Flux::diff] goes in object');

                //constructors
                if(a.constructor != b.constructor)
                    return true;

                //prototypes
                if(a.prototype != b.prototype)
                    return true;

                //proto
                if(a.__proto__ != b.__proto__)
                    return true;


                if ((a instanceof Date && b instanceof Date) ||
                    (a instanceof RegExp && b instanceof RegExp) ||
                    (a instanceof String && b instanceof String) ||
                    (a instanceof Number && b instanceof Number)) {
                    console.log('\t'.repeat(nesting) + '[Flux::diff] is one of the bases instances');
                    if(a.toString() != b.toString())
                        return true;
                }

                //array

                if(a instanceof Array && b instanceof Array){
                    console.log('\t'.repeat(nesting) + '[Flux::diff] goes in array');

                    if(a.length != b.length){
                        console.log('\t'.repeat(nesting) + a.length+' != '+b.length);
                        return true;
                    }

                    if(level == 0)
                        return false;

                    var ret = true, dif;
                    for(var i = 0; i < a.length; i++){
                        dif = !this.diff(a[i],b[i],level > 0 ? --level : level);
                        ret = ret && dif;
                        console.log('\t'.repeat(nesting) + 'diff called with '+a[i]+' && '+b[i]+' for array iteration (diff result/acutal ret)',!dif,ret);
                    }
                    return !ret;

                }

                console.log('\t'.repeat(nesting) + '[Flux::diff] goes in plain object');

                //same obj
                if(Object.keys(a).length != Object.keys(b).length){
                    console.log('\t'.repeat(nesting) + 'a && b keys length differents : '+Object.keys(a).length+ ' != '+ Object.keys(b).length);
                    return true;
                }

                if(level == 0)
                    return false;

                var ret = true, dif;
                for(var k in a){
                    if(b.hasOwnProperty(k) === false){
                        console.log('\t'.repeat(nesting) + 'b doesn\'t have '+k+' prop',b);
                        return true;
                    }
                    dif = !this.diff(a[k],b[k],level > 0 ? --level : level);
                    ret = ret && dif;
                    console.log('\t'.repeat(nesting) + 'diff called with '+a[k]+' && '+b[k]+' for object iteration (diff result/acutal ret)',!dif,ret);
                }
                return !ret;

                break;

            case "function":
                console.log('\t'.repeat(nesting) + '[Flux::diff] goes in function');
                if(a.toString() != b.toString()){
                    console.log('\t'.repeat(nesting) + a.toString()+' != '+b.toString());
                    return true;
                }

                break;

            case "string":
                console.log('\t'.repeat(nesting) + '[Flux::diff] goes in string');
                if(a != b){
                    console.log('\t'.repeat(nesting) + a+' != '+b);
                    return true;
                }
                break;

            case "number":
                console.log('\t'.repeat(nesting) + '[Flux::diff] goes in number');
                if(a != b){
                    console.log('\t'.repeat(nesting) + a+' != '+b);
                    return true;
                }

                break;

            case "undefined":
                console.log('\t'.repeat(nesting) + '[Flux::diff] goes in undefined');
                break;
        }
        return false;
    }

    Flux.prototype.setState = function (state,shallow) {

        if(shallow === void 0)
            shallow = 1;

        console.log('[Flux::setState] called',arguments);

        if(typeof state != "object") return false;

        if(Array.isArray(state)) return false;

        if(Object.keys(state).length == 0) return false;

        console.log('[Flux::setState] cmp last maj/new maj',this.lastMaj,state);

        if(this.diff(this.lastMaj,state,shallow) === false) return false;

        console.log('[Flux::setState] differences found');

        this.store.push(Object.assign({},this.state));

        this.lastMaj = state;

        this.state = Object.assign({},this.state,state);

        console.log('[Flux::setState] merged states',this.state);

        return true;

    };

    return Flux;

}());

module.exports = Flux;