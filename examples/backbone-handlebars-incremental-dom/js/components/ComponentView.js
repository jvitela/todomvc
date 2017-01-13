import _        from 'underscore'
import Backbone from 'backbone'

export default class ComponentView extends Backbone.View {
  initialize({ state, template }) {
    console.log("ComponentView::initialize");
    this.setTemplate(template).setState(state);
  }

  componentDidUpdate() {
    return this;
  }

  getState() { 
    return null;
  }

  setState(data) {
    return this;
  }

  setTemplate(template) {
    template && (this._template = template);
    return this;
  }

  render() {
    console.log("ComponentView::render");

    if (this._template) {
      this._template.render(this.getState());
    } else if (this.template) {
      this.template(this.el, this.getState());
    }
    _.defer(() => this.componentDidUpdate());
    return this;
  }
}