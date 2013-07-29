
/**
 * Module dependencies
 */

var EventEmitter = require('events').EventEmitter
  , domify = require('domify')
  , $ = document.querySelectorAll


/**
 * `Container` constructor
 *
 * @api public
 * @param {Object} `opts`
 */

module.exports = Container;
function Container (opts) {
	if (!(this instanceof Container)) return new Container(opts);
	else if ('object' !== typeof opts) throw new TypeError("expecting object");
	app.Module.call(this, opts);
	this.ui = app.ui.TopcoatElement(document.createElement('div'));
	this.el = this.ui.el;
	this.addClass('container');
	this.id(opts.id);
}

// inherit `app.Module`
Container.prototype.__proto__ = app.Module.prototype;

