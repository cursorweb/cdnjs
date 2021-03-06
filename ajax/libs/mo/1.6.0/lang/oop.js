(function(){
/**
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2012, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
var es5 = require('./es5');
var _ = require('./mix');

    var mix = _.mix;

    exports.construct = function(base, mixes, factory){
        if (mixes && !Array.isArray(mixes)) {
            factory = mixes;
        }
        if (!factory) {
            factory = function(){
                this.superConstructor.apply(this, arguments);
            };
        }
        if (!base.__constructor) {
            base.__constructor = base;
            base.__supr = base.prototype;
        }
        var proto = Object.create(base.prototype),
            supr = Object.create(base.prototype),
            current_supr = supr;
        supr.__super = base.__supr;
        var sub = function(){
            this.superMethod = sub.__superMethod;
            this.superConstructor = su_construct;
            this.constructor = sub.__constructor;
            this.superClass = supr; // deprecated!
            return factory.apply(this, arguments);
        };
        sub.__supr = supr;
        sub.__constructor = sub;
        sub.__superMethod = function(name, args){
            var mysupr = current_supr;
            current_supr = mysupr.__super;
            var re = mysupr[name].apply(this, args);
            current_supr = mysupr;
            return re;
        };
        sub.prototype = proto;
        if (mixes) {
            mixes = mix.apply(this, mixes);
            mix(proto, mixes);
            mix(supr, mixes);
        }
        function su_construct(){
            var cache_constructor = base.__constructor,
                cache_super_method = base.__superMethod;
            base.__constructor = sub;
            base.__superMethod = sub.__superMethod;
            _apply.prototype = base.prototype;
            var su = new _apply(base, this, arguments);
            for (var i in su) {
                if (!this[i]) {
                    this[i] = supr[i] = su[i];
                }
            }
            base.__constructor = cache_constructor;
            base.__superMethod = cache_super_method;
            this.superConstructor = su_construct;
        }
        return sub;
    };

    function _apply(base, self, args){
        base.apply(self, args);
    }



})();