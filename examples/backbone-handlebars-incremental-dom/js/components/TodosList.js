import {component}        from 'Lib/backbone-decorators'
import ViewModel          from 'Components/ViewModel'
import TodosCollection    from 'Models/TodosCollection'
import template           from 'Templates/todos-list.hbs'

const ENTER_KEY = 13;
const ESC_KEY   = 27;

@component({
  tagName:  'todos-list',
  template: template
})
export default class TodosList extends ViewModel {
  initialize() {
    this.todos = new TodosCollection();
    this.listenTo(this.todos, "add remove change", this.render);
  }

  setState({ todos, onChange, onCompleted, onEditing, onRemove }) {
    this.todos.set(todos.models);
    this.removeTodo      = onRemove;
    this.editTodo        = onChange;
    this.toggleEditing   = onEditing;
    this.toggleCompleted = onCompleted;
  }

  onKeyDown(todo, event) {
    if (event.which === ESC_KEY) {
      this.toggleEditing(todo);
    }
  }

  onKeyPress(todo, event) {
    if (event.which === ENTER_KEY) {
      this.editTodo(todo, event.target.value);
    }
  }

  afterRender() {
    if (this.todos.findWhere({ editing: true})) {
      this.$("input").select().focus();
    }
  }
}