import _          from 'underscore'
import handlebars from 'handlebars-incremental-dom'
import Adapter    from 'Lib/backbone-hbs-idom-adapter'

export function component({tagName, template = null}) {
  return function decorator(target) {
    if (typeof template == "string") {
      template = handlebars.compile(template, {"name": tagName});
    }

    target.prototype.tagName  = tagName;
    target.prototype.template = template;
    Adapter.registerComponent(tagName, target);
  }
}

export function event(eventName) {
  return function decorator(target, name, descriptor) {
    if (!target.events) {
      target.events = {};
    }
    if (_.isFunction(target.events)) {
      throw new Error('The event decorator is not compatible with an events method');
      return;
    }
    if (!eventName) {
      throw new Error('The event decorator requires an eventName argument');
    }
    target.events[eventName] = name;
    return descriptor;
  }
}

// export function bind() {
//   return function decorator(target, name, descriptor) {
//     if (!_.isFunction(target[name])) {
//       throw new Error('The bind decorator is only compatible with methods');
//       return;
//     }
//     target[name] = _.bind(target[name], target);
//     return descriptor;
//   }
// }


/**
 * Took from http://babeljs.io/
 */
function defineProperties(target, props) {
  for (let i = 0; i < props.length; i++) {
    let key = props[i];
    let get = function get()    { return this.get(key);      };
    let set = function set(val) { return this.set(key, val); };
    let descriptor = { key,  get, set, enumerable: false, configurable: true };
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

export function defaults(defaultProps) {
  return function decorator(target) {
    target.prototype.defaults = defaultProps;
    defineProperties(target.prototype, Object.keys(defaultProps));
  }
}

export function props(value) {
  return function decorator(target) {
    _.extend(target.prototype, value);

    if (value && value.defaults) {
      defineProperties(target.prototype, Object.keys(value.defaults));
    }
  }
}