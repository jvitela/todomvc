import {component}     from 'Lib/backbone-decorators'
import ViewModel       from 'Components/ViewModel'
import TodosCollection from 'Models/TodosCollection'
import template        from 'Templates/todos-footer.hbs'
import Backbone        from 'backbone'

@component({
  tagName: 'todos-footer',
  template: template
})
export default class TodosFooter extends ViewModel {
  initialize() {
    this.filter    = new Backbone.Model();
    this.pending   = new TodosCollection();
    this.completed = new TodosCollection();

    this.listenTo(this.pending,   'add remove', this.requestRender);
    this.listenTo(this.completed, 'add remove', this.requestRender);
    this.listenTo(this.filter,    'change',     this.requestRender);
  }

  setState({ todos, filter, clearCompleted }) {
    let completed = todos.groupBy('completed');
    this.pending.set(completed[false]  || []);
    this.completed.set(completed[true] || []);

    // Reset the filter values
    this.filter.clear({ silent: true });
    this.filter.set(filter.toJSON());

    this.clearCompleted = clearCompleted;
  }

  get allVisible() {
    return Object.keys(this.filter.attributes).length === 0;
  }

  get onlyActive() {
    return this.filter.get('completed') === false;
  }

  get onlyCompleted() {
    return this.filter.get('completed') === true;
  }
}