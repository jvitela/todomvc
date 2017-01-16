'use strict';

var HandlebarsIdom = require('handlebars-incremental-dom');

/**
 * Precompiles the templates and register the fragments and partials
 */
module.exports = function(source) {
  var path, cls, src  = HandlebarsIdom.compile(source, { asString: true });

  this.cacheable && this.cacheable();
  // Get the filename
  path = this.resourcePath.split("/").pop().split(".")[0]; // /^([^\/]+\/)+([^\/]+)\.hbs$/g
  cls  = path.replace(/-([a-z])/gi, function($0, $1) { return $1.toUpperCase(); } );
  cls  = cls[0].toUpperCase() + cls.slice(1);

  // '  var currContext;\n' +
  // '  options        = options || {};\n' +
  // '  parentContext  = options.context || parentContext;\n' +
  // '  currentContext = data;\n' +
  // '  if (parentContext) {'
  // '    currentContext       = hbs.context(data, parentContext);\n' +
  // '    currentContext._body = options.fragment;\n' +
  // '  }\n'+

  return 'var hbs = require("handlebars-incremental-dom");'+
  'var viewModel  = require("Components/'+ cls +'").default;' + 
  'var idom = hbs.idom;'+
  'function update(data) {'+ 
    src.main +
  '}' +
  'function render(element, data) {' +
  '  if (element) {' +
  '    idom.patch(element, update, data);' +
  '  } else {' +
  '    update(data);' +
  '  }' +
  '}' +
  (src.fragments ? 'hbs.registerFragments(' + src.fragments +');' : '') +
  'hbs.registerPartial("' + path +'",   render);' +
  'hbs.registerComponent("' + path +'", viewModel);'+
  'viewModel.prototype.__template = render;'+
  'console.log("Paths", "' + path +','+ cls +'");'+
  'console.log("View Model", viewModel);'+
  'module.exports = viewModel;';
};