import Backbone from 'backbone'

export default class ComponentView extends Backbone.View {
  getState() { 
    return this;
  }

  setState(data) {
    // _.extend(this, data);
    return this;
  }

  configTemplate(opts) {
    this._templateOptions = opts;
    return this;
  }

  render() {
    let data = this.getState();
    console.log(this.el.tagName + ':' + this.cid);
    this.template(this.el, data, this._templateOptions);
    return this;
  }
}