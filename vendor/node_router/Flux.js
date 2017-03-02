var Flux = (function () {

    function Flux(){
        this.state = {};
        this.store = [];
        this.last = {};
    }

    Flux.prototype.init = function (initialState) {
        if(Object.keys(initialState).length == 0) return;
        this.state = initialState;
    };

    Flux.prototype.getState = function (prop,value,retrieveWholeState) {
        var whole = retrieveWholeState || false;
        if(typeof prop == "object") {
            for(var p in this.state){
                if(this.stripSlashes(this.state[p]) != prop[p] && this.state[p] != prop[p]){
                    if(whole)
                        return this.utils.assign_(this.state);
                    var ret = {};
                    ret[p] = this.state[p];
                    return this.utils.assign_(ret);
                }
            }
            var chosen = false,
                propsIndices;
            for(var i = 0; i < this.store.length; i++){
                propsIndices = [];
                chosen = true;
                for(var p in this.store[i]){
                    if(this.stripSlashes(this.store[i][p]) != prop[p] && this.store[i][p] != prop[p]){
                        chosen = false;
                        break;
                    }
                    else
                        propsIndices.push(p);
                }
                if(chosen) {
                    if(whole)
                        return this.utils.assign_(this.store[i]);
                    var ret = {};
                    for(var i = 0; i < propsIndices.length; i++)
                        ret[propsIndices[i]] = this.store[i][propsIndices[i]];
                    return this.utils.assign_(ret);
                }
            }
            return -1;
        }
        else if(typeof prop == "string" && !!value) {
            for (var p in this.state){
                if (p == prop && ((this.state[p] == value) || (this.stripSlashes(this.state[p]) == value))){
                    if(whole)
                        return this.utils.assign_(this.state);
                    var ret = {};
                    ret[p] = this.state[p];
                    return this.utils.assign_(ret);
                }
            }
            for (var i = 0; i < this.store.length; i++){
                for (var p in this.store[i]){
                    if (p == prop && ((this.store[i][p] == value) || (this.stripSlashes(this.store[i][p]) == value))){
                        if(whole)
                            return this.utils.assign_(this.store[i]);
                        var ret = {};
                        ret[p] = this.store[i][p];
                        return this.utils.assign_(ret);
                    }
                }
            }
            return -1;
        }
        else {
            return this.utils.assign_(this.state);
        }
    };

    Flux.prototype.stripSlashes = function(str){
        return str.replace(/^\//,'').replace(/\/$/,'');
    };

    Flux.prototype.diff = function (a,b) {
        console.log('[Flux::diff] called',arguments);
        if(typeof a != "object")
            a = Object.create(a);
        if(typeof b  != "object")
            b = Object.create(b);
        var a_length = Object.keys(a).length,
            b_length = Object.keys(b).length;
        if(a_length == 0 || b_length == 0) return true;
        //we want to iterate on the more little
        for(var k_a in a)
            if(typeof a[k_a] == "object") a_length+=Object.keys(a[k_a]).length;
        for(var k_b in b)
            if(typeof b[k_b] == "object") b_length+=Object.keys(b[k_b]).length;
        if(a_length > b_length){
            var c = a;
            a = b;
            b = c;
        }
        for(var k in a){
            console.log('[Flux::diff] '+k+' in ',b,(k in b),!(k in b));
            if(!(k in b))
                return true;
            //k is in a and b at the same nesting level
            //need to compare values and sub-structures now
            console.log('[Flux::diff] typeof '+a[k]+' != typeof '+b[k],typeof a[k] != typeof b[k]);
            if(typeof a[k] != typeof b[k])
                return true;
            //compare object / arrays
            console.log('[Flux::diff] typeof '+a[k],typeof a[k]);
            switch(typeof a[k]){
                case "object":
                    console.log('[Flux::diff] goes in object');
                    console.log('[Flux::diff] '+a[k].constructor+' != '+b[k].constructor,a[k].constructor != b[k].constructor);
                    if(a[k].constructor != b[k].constructor)
                        return true;
                    console.log('[Flux::diff] instances ',(a[k] instanceof Date && b[k] instanceof Date) ||
                        (a[k] instanceof RegExp && b[k] instanceof RegExp) ||
                        (a[k] instanceof String && b[k] instanceof String) ||
                        (a[k] instanceof Number && b[k] instanceof Number));

                    if ((a[k] instanceof Date && b[k] instanceof Date) ||
                        (a[k] instanceof RegExp && b[k] instanceof RegExp) ||
                        (a[k] instanceof String && b[k] instanceof String) ||
                        (a[k] instanceof Number && b[k] instanceof Number)) {
                        console.log('[Flux::diff] is one of the bases instances');
                        console.log('[Flux::diff] '+a[k].toString()+' != '+b[k].toString(),a[k].toString() != b[k].toString());
                        if(a[k].toString() != b[k].toString())
                            return true;
                    }
                    console.log('[Flux::diff] '+a[k]+' instanceof Array && '+b[k]+' instanceof Array',a[k] instanceof Array && b[k] instanceof Array);
                    if(a[k] instanceof Array && b[k] instanceof Array){
                        console.log('[Flux::diff] '+a[k].length+' != '+b[k].length,a[k].length != b[k].length);
                        if(a[k].length != b[k].length)
                            return true;
                        for(var i = 0; i < a[k].length; i++){
                            console.log('[Flux::diff] same obj => recursivity this.diff('+a[k]+','+b[k]+')');
                            this.diff(a[k],b[k]);
                        }

                    }
                    //same obj
                    console.log('[Flux::diff] same obj => recursivity this.diff('+a[k]+','+b[k]+')');

                    this.diff(a[k],b[k]);
                    break;
                case "function":
                    console.log('[Flux::diff] goes in function');
                    console.log('[Flux::diff] '+a[k].toString()+' != '+b[k].toString(),a[k].toString() != b[k].toString());
                    if(a[k].toString() != b[k].toString())
                        return true;
                    break;
                case "string":
                    console.log('[Flux::diff] goes in string');
                    console.log('[Flux::diff] '+a[k]+' != '+b[k],a[k] != b[k]);
                    if(a[k] != b[k])
                        return true;
                    break;
                case "number":
                    console.log('[Flux::diff] goes in number');
                    console.log('[Flux::diff] '+a[k]+' != '+b[k],a[k] != b[k]);
                    if(a[k] != b[k])
                        return true;
                    break;
                case "undefined":
                    console.log('[Flux::diff] goes in undefined');
                    break;
            }
        }
        console.log('[Flux::diff] end => return false');
        return false;
    };

    Flux.prototype.setState = function (state) {

        console.log('[Flux::setState] called',arguments);

        if(typeof state != "object" || Array.isArray(state)) return false;


        console.log('[Flux::setState] cmp last/state',this.last,state);

        if(!this.diff(this.last,state)) return false;

        console.log('[Flux::setState] cmp now/state',this.state,state);

        if(!this.diff(this.state,state)) return false;



        this.store.push(this.utils.assign_(this.state));

        this.last = state;

        for(var prop in state) {
            if (typeof state[prop] == "object") {
                if (Array.isArray(state[prop]))
                    this.state[prop] = this.utils.map_(state[prop]);
                else
                    this.state[prop] = this.utils.assign_(state[prop]);
            }
            else
                this.state[prop] = state[prop];
        }

        console.log('[Flux::setState] merged states',this.state);

        return true;

    };

    Flux.prototype.utils = {
        assign_: function (obj) {
            var dup = {};
            for(var k in obj){
                dup[k] = typeof obj[k] == "object" ? Array.isArray(obj[k]) ? this.map_(obj[k]) : this.assign_(obj[k]) : obj[k];
            }
            return dup;
        },
        map_: function (arr) {
            var dup = [];
            for(var i = 0; i < arr.length; i++){
                dup[i] = typeof arr[i] == "object" ? Array.isArray(arr[i]) ? this.map_(arr[i]) : this.assign_(arr[i]) : arr[i]
            }
            return dup;
        }
    };

    return Flux;

}());

module.exports = Flux;