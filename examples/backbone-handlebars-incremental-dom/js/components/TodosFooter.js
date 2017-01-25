import {component}     from 'Lib/backbone-decorators'
import ComponentView   from 'Components/ComponentView'
import TodosCollection from 'Models/TodosCollection'
import template        from 'Templates/todos-footer.hbs'
import Backbone        from 'backbone'

@component({
  tagName: 'todos-footer',
  template: template
})
export default class TodosFooter extends ComponentView {
  initialize() {
    this.filter    = new Backbone.Model();
    this.pending   = new TodosCollection();
    this.completed = new TodosCollection();

    this.listenTo(this.pending,   "add remove", this.render);
    this.listenTo(this.completed, "add remove", this.render);
    this.listenTo(this.filter,    "change",     this.render);
  }

  setState({ todos, filter, clearCompleted }) {
    let completed = todos.groupBy('completed');

    this.filter.clear({ silent: true });
    this.filter.set(filter.toJSON());
    this.pending.set(completed[false]  || []);
    this.completed.set(completed[true] || []);
    this.clearCompleted = clearCompleted;
  }

  get allVisible() {
    console.log("allVisible::", this.filter.attributes);
    return Object.keys(this.filter.attributes).length === 0;
  }

  get onlyActive() {
    return this.filter.get('completed') === false;
  }

  get onlyCompleted() {
    return this.filter.get('completed') === true;
  }
}