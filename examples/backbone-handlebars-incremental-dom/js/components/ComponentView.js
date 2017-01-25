import _          from 'underscore'
import Backbone   from 'backbone'
// import {debounce} from 'Lib/backbone-decorators'

export default class ComponentView extends Backbone.View {

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
      throw new Error('ComponentView::configureRouter requires a routes attribute to be set. See "@route" decorator');
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
}