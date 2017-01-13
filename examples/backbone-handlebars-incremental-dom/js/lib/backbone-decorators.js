import handlebars from 'handlebars-incremental-dom'
import Adapter    from './backbone-hbs-idom-adapter'

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
  return function(target, name, descriptor) {
    if(!target.events) {
      target.events = {};
    }
    if(_.isFunction(target.events)) {
      throw new Error('The event decorator is not compatible with an events method');
      return;
    }
    if(!eventName) {
      throw new Error('The event decorator requires an eventName argument');
    }
    target.events[eventName] = name;
    return descriptor;
  }
}
