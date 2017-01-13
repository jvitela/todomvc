import handlebars from 'handlebars-incremental-dom';

var   ViewClasses   = {};
var   ViewInstances = {};
const VIEW_CID      = Symbol('view-model-cid');

/**
 * 
 * @param  Node node The DOM node to inspect
 * @return The view instance or null if the given node is not related to any
 */
function getViewInstance(node) {
  let cid = node && node.nodeType == 1 && node[VIEW_CID];
  return cid ? ViewInstances[cid] : null;
}

/**
 * Creates or retrieves a view for the given DOM element and runs the update method
 * @param  Element el    The DOM Element to associate to a View
 * @param  Object props  Properties map
 * @return Object        The view instance
 */
function viewsFactory(props, template) {
  let el   = template.el;
  let cid  = el[VIEW_CID];
  let view = cid && ViewInstances[cid];
  if (!view) {
    name = el.tagName.toLowerCase();

    // Not registered
    if (!ViewClasses[name]) {
      return null;
    }

    // Instantiate the component
    view = new ViewClasses[name]({
      el,
      props,
      template,
    });
    cid = el[VIEW_CID] = view.cid;
    ViewInstances[cid] = view;
    console.log('viewsFactory::create', el, view);
  }
  else {
    view.setTemplate(template);
    view.setState(props);    
  }

  return view;
}

/**
 * Garbage Collector
 * @param  array nodes Array of removed DOM Nodes
 */
function garbageCollector(nodes) {
  let view;
  nodes.forEach((node) => {
    view = getViewInstance(node);
    if (view) {
      console.log('garbageCollector::delete', node, view);
      view.remove();
      ViewInstances[view.cid] = null;
    }
  });
}

/**
 * Register Component
 * @param  String tagName
 * @param  Class  View
 */
function registerComponent(tagName, View) {
  if (typeof View.prototype.template === "string") {
    console.log(`registerComponent: Compiling template for ${tagName} ...`);
    compile(View.prototype.template, {'name': tagName});
  }
  ViewClasses[tagName] = View;
}

/**
 * Register Handlebars Helpers
 */
function registerHandlebarsHelpers() {

  // {{call method p1 p2 ...p3}}
  handlebars.registerHelper('call', function(fn) {
    let args   = Array.from(arguments).slice(1);
    return function(event) {
      args.push(event);
      return fn.apply(this, args);
    };
  });

  // {{inc number}}
  handlebars.registerHelper('inc', function(index) {
    return parseInt(index) + 1;
  });
}

/**
 * Initializes the application
 */
function initialize() {

  registerHandlebarsHelpers();

  handlebars.getComponentProxy = viewsFactory;

  // Attributes that *must* be set via a property on all elements.
  handlebars.idom.attributes.value     = handlebars.idom.applyProp;
  handlebars.idom.attributes.checked   = handlebars.idom.applyProp;
  handlebars.idom.attributes.className = handlebars.idom.applyProp;
  handlebars.idom.attributes.disabled  = handlebars.idom.applyProp;

  // Notifications
  handlebars.idom.notifications.nodesDeleted = garbageCollector;
}

window.views = ViewInstances;
export default {
  initialize:        initialize,
  registerComponent: registerComponent
};