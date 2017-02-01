import {handlebars, incrementalDOM} from 'handlebars-incremental-dom/runtime'
import RenderScheduler from 'Lib/RenderScheduler'

export var   RenderQueue   = new RenderScheduler();
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
 * @param  Element el       The DOM Element to associate to a View
 * @param  string  cmpName  The component tag name 
 */
function viewsFactory(el, cmpName) {
  let cid  = el[VIEW_CID];
  let view = cid && ViewInstances[cid];
  if (!view) {

    // Not registered
    if (!ViewClasses[cmpName]) {
      return null;
    }

    // Instantiate the component
    view = new ViewClasses[cmpName]({ el });
    cid = el[VIEW_CID] = view.cid;
    ViewInstances[cid] = view;
    // console.log('viewsFactory::create', view.cid);
  }

  return view;
}

/**
 * @param Element el         The DOM Element to associate to a View
 * @param string  tagName    The component tag name 
 * @param object  properties Properties map
 * @param object  options    Config options to pass to the template
 */
function renderComponent(el, tagName, properties, options) {
  incrementalDOM.skip();
  let view = viewsFactory(el, tagName);
  view.configureTemplate(options);
  view.setState(properties);
  view.render();
  // RenderQueue.addNext(view.cid, () => { });
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
      // console.log('garbageCollector::delete', view.cid);
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
  if (typeof View.prototype.template === 'string') {
    // console.log(`registerComponent: Compiling template for ${tagName} ...`);
    compile(View.prototype.template, {'name': tagName});
  }
  ViewClasses[tagName] = View;
}

/**
 * Register Handlebars Helpers
 */
function registerHandlebarsHelpers() {

  // {{call method p1 p2 ...p3}}
  handlebars.registerHelper('call', function(fn, ...params) {
    let opts = params.pop(); // remove the handlebars data
    return function(event) {
      let args = params.slice(); // create a copy
      args.push(event);          // append event
      return fn.apply(opts.data.root, args);
    };
  });

  // {{inc number}}
  // handlebars.registerHelper('inc', function(index) {
  //   return parseInt(index) + 1;
  // });
}

/**
 * Initializes the application
 */
function initialize() {

  registerHandlebarsHelpers();

  handlebars.renderComponent = renderComponent;

  // Attributes that *must* be set via a property on all elements.
  incrementalDOM.attributes.value     = incrementalDOM.applyProp;
  incrementalDOM.attributes.checked   = incrementalDOM.applyProp;
  incrementalDOM.attributes.className = incrementalDOM.applyProp;
  incrementalDOM.attributes.disabled  = incrementalDOM.applyProp;

  // Notifications
  incrementalDOM.notifications.nodesDeleted = garbageCollector;
}

window.handlebars = handlebars;
window.views = ViewInstances;
export default {
  initialize:        initialize,
  registerComponent: registerComponent
};
