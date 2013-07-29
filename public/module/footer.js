
/**
 * `Footer` constructor
 *
 * @api public
 * @param {Object} `opts`
 */

module.exports = Footer;
function Footer (opts) {
	if (!(this instanceof Footer)) return new Footer(opts);
	else if ('object' !== typeof opts) throw new TypeError("expecting object");
	app.Module.call(this, opts);
	this.ui = app.ui.TopcoatElement(document.createElement('footer'));
	this.el = this.ui.el;
	this.addClass('footer');
	this.id(opts.id);
}

// inherit from `app.Module`
Footer.prototype.__proto__ = app.Module.prototype;