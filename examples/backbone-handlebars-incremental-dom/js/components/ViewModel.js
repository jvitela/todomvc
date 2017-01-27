import _          from 'underscore'
import Backbone   from 'backbone'
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
 *     - afterRender
 *     - remove
 */
export default class ViewModel extends Backbone.View {

  getState() {
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
    if (!this.routes) {
      throw new Error('ViewModel::configureRouter requires a routes attribute to be set. See "@route" decorator');
    }
    let routes = _.mapObject(this.routes, (method) => {
      return _.bind(this[method], this);
    });
    this.router = new Backbone.Router({ routes });
  }

  beforeRender() {}
  afterRender()  {}

  render() {
    let data = this.getState();

    console.log(this.el.tagName + ':' + this.cid);

    this.beforeRender();
    this.template(this.el, data, this._templateOptions);
    this.afterRender();

    return this;
  }

  requestRender() {
    RenderQueue.add(this.cid, () => {
      this.render();
    });
  }
}