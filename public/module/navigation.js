
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
 */

module.exports.Navigation = Navigation;
function Navigation (opts) {
	if (!(this instanceof Navigation)) return new Navigation(opts);
	else if ('object' !== typeof opts) throw new TypeError("expecting object");
	app.ui.TopcoatElement.call(this);
	this.ui = app.ui.NavigationBar();
	this.el = domify(
		'<header class="navigation"></header>'
	);

	this.el.setAttribute('id', opts.id || 'nav-'+ Math.random().toString('16').slice(1));
	this.ui.appendTo(this.el);
}

// inherit `app.ui.TopcoatElement`
Navigation.prototype.__proto__ = app.ui.TopcoatElement.prototype;


/**
 * Initializes the navigation
 *
 * @api public
 * @param {Object} `opts`
 */

Navigation.prototype.init = function (opts) {
	if ('object' !== typeof opts) throw new TypeError("expecting object");
	var root = opts.root || $('body')[0]

	if (!(root instanceof Element)) throw new TypeError("expecting `Element` as `.root` ");
	this.appendTo(root);

	return this;
};