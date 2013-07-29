
/**
 * Module dependencies
 */

var EventEmitter = require('events').EventEmitter
  , domify = require('domify')
  , $ = document.querySelectorAll


/**
 * `Module` constructor
 *
 * @api public
 * @param {Object} `opts`
 */

module.exports = Module;
function Module (opts) {
	if (!(this instanceof Module)) return new Module(opts);
	else if ('object' !== typeof opts) throw new TypeError("expecting object");
	app.ui.TopcoatElement.call(this);
	this.ui = app.ui.TopcoatElement(document.createElement('div'));
	this.el = this.ui.el;

	this.addClass('module');
	this.id(opts.id);
}

// inherit `app.ui.TopcoatElement``
Module.prototype.__proto__ = app.ui.TopcoatElement.prototype;

/**
 * Initializes the module
 *
 * @api public
 * @param {Object} `opts`
 */

Module.prototype.init = function (opts) {
	if ('object' !== typeof opts) throw new TypeError("expecting object");
	var root = opts.root || $('body')[0]

	if (!(root instanceof Element)) throw new TypeError("expecting `Element` as `.root` ");
	this.appendTo(root);

	return this;
};


/**
 * Sets the id of the element. falls back to a random unique id
 *
 * @api public
 * @param {String} `id` - optional
 */

Module.prototype.id = function (id) {
	this.el.setAttribute('id', id || 'module-'+ Math.random().toString('16').slice(1));
	return this;
};