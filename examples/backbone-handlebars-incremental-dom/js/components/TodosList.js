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
    this.listenTo(this.todos, 'add remove change', this.render);
  }

  setState({ todos, onChange, onCompleted, onEditing, onRemove, onCompleteAll, allCompleted }) {
    this.todos.set(todos);
    this.removeTodo      = onRemove;
    this.editTitle       = onChange;
    this.toggleEditing   = onEditing;
    this.toggleCompleted = onCompleted;
    this.completeAll     = onCompleteAll;
    this.allCompleted    = allCompleted;
  }

  editTodo(todo, event) {
    switch (event.which) {
      case ESC_KEY:
        this.toggleEditing(todo, false);
        break;
      case ENTER_KEY:
        this.editTitle(todo, event.target.value);
        break;
    }
  }

  toggleAll(event) {
    this.completeAll(event.target.checked);
  }

  afterRender() {
    if (this.todos.findWhere({ editing: true})) {
      this.$('input.edit.on').select().focus();
    }
  }
}