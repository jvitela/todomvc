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

export function route(path) {
  return function decorator(target, name, descriptor) {
    if (!target.__proto__.routes) {
      target.__proto__.routes = {};
    }
    if (!path) {
      throw new Error('The event decorator requires a path argument');
    }
    target.__proto__.routes[path] = name;
    return descriptor;
  }
}

// export function event(eventName) {
//   return function decorator(target, name, descriptor) {
//     if (!target.__proto__.events) {
//       target.__proto__.events = {};
//     }
//     if (_.isFunction(target.__proto__.events)) {
//       throw new Error('The event decorator is not compatible with an events method');
//       return;
//     }
//     if (!eventName) {
//       throw new Error('The event decorator requires an eventName argument');
//     }
//     target.__proto__.events[eventName] = name;
//     return descriptor;
//   }
// }

// export function bind() {
//   return function decorator(target, name, descriptor) {
//     if (!_.isFunction(target.__proto__[name])) {
//       throw new Error('The bind decorator is only compatible with methods');
//       return;
//     }
//     target.__proto__[name] = _.bind(target.__proto__[name], target);
//     return descriptor;
//   }
// }


// export function debounce(milliseconds) {
//   return function decorator(target, name, descriptor) {
//     target.__proto__.fnDebounced[name] = milliseconds;
//     return descriptor;
//   }
// }

/** 
 * Decorates a class method so that it is debounced by the specified duration
 * Inspired by https://github.com/bvaughn/debounce-decorator
 * 
 * @param  number duration   The amount of milliseconds
 * 
 * @return object Descriptor
 */
export function debounce (duration) {
  return function decorator (target, key, descriptor) {
    // Return a new descriptor
    return {
      configurable: true,
      enumerable:   descriptor.enumerable,
      get: function getter() {

        // Attach this function to the instance (not the class)
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable:   descriptor.enumerable,
          value:        _.debounce(descriptor.value, duration)
        });

        // Return the getter
        return this[key];
      }
    }
  }
}

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

// export function defaults(defaultProps) {
//   return function decorator(target) {
//     target.prototype.defaults = defaultProps;
//     defineProperties(target.prototype, Object.keys(defaultProps));
//   }
// }

export function props(value) {
  return function decorator(target) {
    _.extend(target.prototype, value);

    if (value && value.defaults) {
      defineProperties(target.prototype, Object.keys(value.defaults));
    }
  }
}