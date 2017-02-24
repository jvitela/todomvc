import _             from 'underscore'
import Backbone      from 'backbone'
import {RenderQueue} from 'Lib/backbone-hbs-idom-adapter'

/**
 * Base class for all components.
 * 
 * Implements the component's life cycle:
 *     - constructor
 *     - initialize
 *     - setState
 *     - getState
 *     - beforeRender
 *     - render
 *     - afterRender
 *     - remove
 */
export default class ViewModel extends Backbone.View {

  getState() {
    if (this.configureBindables) {
      this.configureBindables();
    }
    return this;
  }

  setState(data) {
    return this;
  }

  configureTemplate(opts) {
    this._templateOptions = opts;
    return this;
  }

  configureRouter() {
    if (!this._routes) {
      throw new Error('ViewModel::configureRouter requires a routes attribute to be set. See "@route" decorator');
    }
    let routes = _.mapObject(this._routes, (method) => {
      return _.bind(this[method], this);
    });
    this.router = new Backbone.Router({ routes });
  }

  configureBindables() {
    console.log("configureBindables start");
    _.each(this._bindables, (cfg, method) => {
      if (cfg.binded) { 
        return; 
      }
      this[method] = _.bind(this[method], this);
      cfg.binded   = true;
    });
    // Execute only once per instance
    this.configureBindables = false;
  }

  beforeRender() {}
  afterRender()  {}

  render() {
    let data = this.getState();

    this.beforeRender();

    RenderQueue.addNext(this.cid, () => {
      // console.log(this.el.tagName + ':' + this.cid);
      this.template(this.el, data, this._templateOptions);
      this.afterRender();
    });

    return this;
  }
}