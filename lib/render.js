
/**
 * Module dependencies.
 */

var views = require('co-views');

// setup views mapping .html
// to the swig template engine #swig 樣版引擎
// render : 提供.給予(我覺得是導向)
module.exports = views(__dirname + '/../views', {
  map: { html: 'swig' }
});