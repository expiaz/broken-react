var Precompiler = (function () {

    function Precompiler(){
        this._tpl;
        this._vars;
    }

    /**
     * launch precompilation
     * @param tpl
     * @param vars
     * @returns new template
     */
    Precompiler.prototype.precompile = function(tpl,vars){
        this._tpl = tpl;
        this._vars = vars;
        this.makeInjections();

        return this._tpl;
    };

    /**
     * replace {{>*}} tags by their content
     */
    Precompiler.prototype.makeInjections = function(){
        var reg = /{{>(\w+)}}/,
            match = [];

        while(match = reg.exec(this._tpl)){
            var v = this._vars,
                t = match[1].split('.');
            for(var i =0; i<t.length; i++)
                v = v[t[i]];
            this._tpl.replace(match[0],v ? v : '');
        }
    };

    return Precompiler;

}());

module.exports = Precompiler;