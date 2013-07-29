
/**
 * Module dependencies
 */

var EventEmitter = require('events').EventEmitter
  , domify = require('domify')
  , $ = document.querySelectorAll


/**
 * `Navigation` constructor
 *
 * @api public
 * @param {Object} `opts`
 */

module.exports = Navigation;
function Navigation (opts) {
	if (!(this instanceof Navigation)) return new Navigation(opts);
	else if ('object' !== typeof opts) throw new TypeError("expecting object");
	app.Module.call(this, opts);
	this.ui = app.ui.NavigationBar();
	this.el = this.ui.el;

	this.addClass('navigation');
	this.id(opts.id);
}

// inherit `app.Module`
Navigation.prototype.__proto__ = app.Module.prototype;