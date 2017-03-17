var Dictionnary = (function () {

    function Dictionnary(){
        this._keys = [];
        this._values = [];
    }

    Dictionnary.prototype.add = function (key,value) {
        if(typeof key == "object"){
            for(var k in key){
                if(typeof k == "object") {
                    this.add(k);
                }
                else if(this.existsKey(k)){
                    this.set(k,key[k]);
                }
                else{
                    this._keys.push(k);
                    this._values.push(key[k]);
                }
            }
        }
        else if(typeof key == "string" && !!value){
            if(this.existsKey(key)){
                this.set(key,value);
            }
            else{
                this._keys.push(key);
                this._values.push(value);
            }
        }
    }

    Dictionnary.prototype.set = function (key,value) {
        if(typeof key == "object"){
            for(var k in key){
                if(typeof k == "object") {
                    this.set(k);
                }
                else if(!this.existsKey(k)){
                    this.add(k,key[k]);
                }
                else{
                    this._values[this._keys.indexOf(k)] = key[k];
                }
            }
        }
        else if(typeof key == "string" && !!value){
            if(!this.existsKey(key)){
                this.add(key,value);
            }
            else{
                this._values[this._keys.indexOf(key)] = value;
            }
        }
    }

    Dictionnary.prototype.get = function (key) {
        return this._values[this._keys.indexOf(key)] || -1;
    }

    Dictionnary.prototype.duplicate = function (key) {
        var ret = this._values.slice(this._keys.indexOf(key), this._keys.indexOf(key) + 1)[0];
        console.log('[Dico::duplicate] return = ',ret);
        if(typeof ret == "object"){
            if(Array.isArray(ret)){
                return this.utils.map_(ret);
            }
            else{
                return this.utils.assign_(ret);
            }
        }
        return ret;
    }

    Dictionnary.prototype.utils = {
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
    }

    Dictionnary.prototype.remove = function (key) {
        if(this._keys.indexOf(key) == -1) return false;
        var index = this._keys.indexOf(key);
        this._keys.splice(index,1);
        return this._values.splice(index,1);
    }

    Dictionnary.prototype.replace = function (key,value) {
        this._values[this._keys.indexOf(key)] = value;
    }

    Dictionnary.prototype.existsKey = function (key) {
        console.log('[Dico::existskey] of '+key+' in ');
        console.log(JSON.stringify(this._keys));
        return this._keys.indexOf(key) != -1;
    }

    Dictionnary.prototype.existsValue = function (value) {
        return this._values.indexOf(value) != -1;
    }

    Dictionnary.prototype.getKey = function (value) {
        return this._keys[this._values.indexOf(value)];
    }

    Dictionnary.prototype.sort = function (fn) {
        if(fn == void 0){
            fn = function(a, b){
                if(a < b) return -1;
                if(a > b) return 1;
                return 0;
            };
        }
        var oldKeys = {};
        for(var i = 0; i < this._keys.length; i++){
            oldKeys[this._keys[i]] = i;
        }
        var newKeys = this._keys.sort(fn),
            newValues = [];
        for(var i = 0; i < this._keys.length; i++){
            newValues[i] = this._values[oldKeys[newKeys[i]]];
        }
        this._keys = newKeys;
        this._values = newValues;
    }

    Dictionnary.prototype.getKeys = function () {
        return this._keys;
    }

    Dictionnary.prototype[Symbol.iterator] = function () {
        var index = 0,
            data  = this._values;

        return {
            next: function() {
                return { value: data[++index], done: !(index in data) }
            }
        };
    }

    return Dictionnary;

}());

module.exports = Dictionnary;