//     Bind.js 1.6.0
//     (c) 2014 Maksym Romaniv, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

    var me = this;

    var Bind = me.Bind;

    var Context, Instance, after, before, chainable, cloneNode, _ref;

    _ref = require('./helpers'), before = _ref.before, after = _ref.after, chainable = _ref.chainable, cloneNode = _ref.cloneNode;

    Instance = require('./instance');

    module.exports = Context = (function() {
        var attach, detach;

        detach = chainable(function() {
            this.parent = this.el.parentNode;
            if (this.parent) {
                this.nextSibling = this.el.nextSibling;
                return this.parent.removeChild(this.el);
            }
        });

        attach = chainable(function() {
            if (this.parent) {
                if (this.nextSibling) {
                    return this.parent.insertBefore(this.el, this.nextSibling);
                } else {
                    return this.parent.appendChild(this.el);
                }
            }
        });

        function Context(el, Transparency) {
            this.el = el;
            this.Transparency = Transparency;
            this.template = cloneNode(this.el);
            this.instances = [new Instance(this.el, this.Transparency)];
            this.instanceCache = [];
        }

        Context.prototype.render = before(detach)(after(attach)(chainable(function(models, directives, options) {
            var children, index, instance, model, _i, _len, _results;

            while (models.length < this.instances.length) {
                this.instanceCache.push(this.instances.pop().remove());
            }
            while (models.length > this.instances.length) {
                instance = this.instanceCache.pop() || new Instance(cloneNode(this.template), this.Transparency);
                this.instances.push(instance.appendTo(this.el));
            }
            _results = [];
            for (index = _i = 0, _len = models.length; _i < _len; index = ++_i) {
                model = models[index];
                instance = this.instances[index];
                children = [];
                _results.push(instance.prepare(model, children).renderValues(model, children).renderDirectives(model, index, directives).renderChildren(model, children, directives, options));
            }
            return _results;
        })));

        return Context;

    })();


    Bind.render = function(context, models, directives, options) {

        var log, base_;

        /** ---------------------------     Underscore implementation    --------------------------- */
        var _ = {};

        _.isArray = nativeIsArray || function(obj) {
            return toString.call(obj) == '[object Array]';
        };
        /** ---------------------------     Underscore implementation    --------------------------- */


        models      = models        || [];
        directives  = directives    || [];
        options     = options       || [];


//        log = options.debug && console ? helpers.consoleLogger : helpers.nullLogger;
//        log("Transparency.render:", context, models, directives, options);
        if (!context) {
            return;
        }
        if (!_.isArray(models)) {
            models = [models];
        }
        context = (_base = helpers.data(context)).context || (_base.context = new Context(context, Transparency));
        return context.render(models, directives, options).el;



    }


}).call(this);