var Dictionnary = require('./../utils/Dictionnary');
var Context = require('./Context');
var Parser = require('./Parser');
var Precompiler = require('./Precompiler');
var Render = require('./Render');

var Chino = (function () {

    function Chino(){
        this._cached = new Dictionnary();
        this.engine = {
            precompiler: new Precompiler(),
            parser: new Parser(),
            context: new Context(),
            render: new Render()
        };
    }

    /**
     * evaluate the validity of expressions in the template
     * @param tpl {string}
     * @returns {boolean}
     */
    Chino.prototype.evaluate = function(tpl){
        var stack = [],
            matches = [],
            termReg = /<%(\w+) *(?:{{(\W)?([^}]+)}})? *(?:(\w+) *{{(\W)?(\w+)}})?%>/gi;

        while (matches = termReg.exec(tpl)){
            stack.length?(matches[1].match(/end/i)?(stack[stack.length-1]==matches[1].replace('end','')?stack.pop():null):stack.push(matches[1])):stack.push(matches[1]);
        }

        return stack.length == 0;
    }

    /**
     * register a template on cache
     * @param tpl
     * @param vars
     * @param name
     * @returns {*}
     */
    Chino.prototype.register = function (tpl,name,vars) {
        if(!tpl || !name)
            throw new Error("Can't register a template without name or content");

        if(!this.evaluate(tpl))
            throw new Error("Fail eval");


        if(typeof vars == "object" && Object.keys(vars).length != 0){
            tpl = this.engine.precompiler.precompile(tpl,vars);
            if(!this.evaluate(tpl))
                throw new Error("Fail precompliation eval");
        }

        tpl = this.engine.parser.parse(tpl);

        this._cached.add(name,JSON.stringify(tpl));

        return this;
    }

    /**
     * lauch rendering
     * @param tpl
     * @param vars
     * @param name
     * @returns {string|*}
     */
    Chino.prototype.render = function(tpl,vars,name){

        console.log('[chino::render] rendering template ' + JSON.stringify(tpl));

        var template;

        if(!vars)
            vars = {};

        if(typeof vars != "object" || Array.isArray(vars))
            throw new Error('vars aren\'t object type');

        console.log('[chino::render] testing this._cached.existsKey('+JSON.stringify(tpl)+') = ');
        console.log(this._cached.existsKey(tpl));
        if (this._cached.existsKey(tpl)){
            template = JSON.parse(this._cached.get(tpl));
        }
        else{
            template = tpl;
            if(!this.evaluate(template))
                throw new Error("Fail eval");
            template = this.engine.precompiler.precompile(template,vars);
            if(!this.evaluate(template))
                throw new Error("Fail precompliation eval");
            template = this.engine.parser.parse(template);
        }

        if(name)
            this._cached.set(name,JSON.stringify(template));

        console.log('rendering template ' + tpl);
        console.log(template);

        template = this.engine.context.contextify(template,vars);
        template = this.engine.render.render(template);

        return template;
    }

    /**
     * display the nodeTree with nesting levels on the console
     * @param tree
     * @param stair
     */
    Chino.prototype.displayNodeTree = function(tree,stair){
        stair = stair || 0;
        var indentation = "\t".repeat(stair);
        console.log(' ');
        console.log(indentation+"***** NODE "+stair+" ******")
        console.log(indentation+tree.expression+(tree.variable ? " {{"+tree.variable+"}}" : ''));
        //console.log(tree.context);
        console.log(indentation +  'content : ' + (tree.content ? tree.content : ''));
        console.log(indentation +  'rendered : ' + (tree.rendered !== undefined ? tree.rendered : ''));
        if(tree.childs)
            for(var n = 0;n<tree.childs.length;n++)
                this.displayNodeTree(tree.childs[n],stair + 1);
    };

    return Chino;

}());

module.exports = Chino;