import {component, bind}  from 'Lib/backbone-decorators'
import ComponentView      from 'Components/ComponentView'
import template           from 'Templates/todos-list.hbs'
import _                  from 'underscore'

import TodosCollection    from 'Models/TodosCollection'

const ENTER_KEY = 13;
const ESC_KEY   = 27;

@component({
  tagName:  'todos-list',
  template: template
})
export default class TodosList extends ComponentView {
  initialize() {
    this.todos = new TodosCollection();
    this.listenTo(this.todos, "add remove change", this.render);
  }

  setState({ todos, onremove }) {
    this.todos.set(todos.models);
    this.removeTodo = onremove;
  }

  toggleCompleted(todo) {
    todo.toggleCompleted();
  }

  toggleEditing(todo) {
    todo.toggleEditing();
  }

  onKeyDown(todo, event) {
    if (event.which != ESC_KEY) {
      return;
    }
    todo.toggleEditing();
  }

  onKeyPress(todo, event) {
    if (event.which != ENTER_KEY) {
      return;
    }
    let title = event.target.value.trim();
    if (!title) {
      this.removeTodo(todo);
      return;
    }
    todo.set({
      title:   title,
      editing: false
    });
  }
}