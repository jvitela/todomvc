import {component, bindable} from 'Lib/backbone-decorators'
import ViewModel   from 'Components/ViewModel'
import template    from 'Templates/todos-header.hbs'
import Todo        from 'Models/Todo'

const ENTER_KEY = 13;

@component({
  tagName:  'todos-header',
  template: template
})
export default class TodosHeader extends ViewModel {
  initialize() {
    this.todo = new Todo();
    this.listenTo(this.todo, 'change:title', this.render);
  }

  setState({ onInput }) {
    this.saveTodo = onInput;
  }

  @bindable()
  setTitle(event) {
    let title = event.target.value.trim();
    if (title) {
      this.todo.title = title;
    }
  }

  @bindable()
  saveOnEnter(event) {
    let title = this.todo.title;
    if (title && event.which === ENTER_KEY) {
      this.saveTodo(title);
      this.todo.title = '';
    }
  }
}