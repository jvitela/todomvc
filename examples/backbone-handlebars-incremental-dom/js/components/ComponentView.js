import Backbone from 'backbone'

export default class ComponentView extends Backbone.View {
  getState() { 
    return this;
  }

  setState(data) {
    _.extend(this, data);
    return this;
  }

  setTemplate(template) {
    if (typeof template === "function") {
      this._template = template; 
    }
    return this;
  }

  render() {
    let state = this.getState();
    
    if (this._template) {
      this._template(state);

    } else if (this.template) {
      this.template(this.el, state);
    }

    return this;
  }
}