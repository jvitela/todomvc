import {component, debounce} from 'Lib/backbone-decorators'
import ViewModel     from 'Components/ViewModel'
import template      from 'Templates/todos-header.hbs'
import Todo          from 'Models/Todo'

const ENTER_KEY = 13;

@component({
  tagName:  'todos-header',
  template: template
})
export default class TodosHeader extends ViewModel {
  initialize() {
    this.todo = new Todo();
    this.listenTo(this.todo, 'change:title', this.requestRender);
  }

  setState({ onInput }) {
    this.onInput = onInput;
  }

  @debounce(200)
  inputChange(event) {
    let title = event.target.value.trim();
    if (title) {
      this.todo.title = title;
    }
  }

  @debounce(201)
  onEnter(event) {
    let title = this.todo.title;
    if (title && event.which === ENTER_KEY) {
      this.todo.title = '';
      this.onInput(title);
    }
  }
}