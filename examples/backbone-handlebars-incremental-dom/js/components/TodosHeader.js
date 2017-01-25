import {component, debounce} from 'Lib/backbone-decorators'
import ComponentView from 'Components/ComponentView'
import template      from 'Templates/todos-header.hbs'
import Todo          from 'Models/Todo'

const ENTER_KEY = 13;

@component({
  tagName:  'todos-header',
  template: template
})
export default class TodosHeader extends ComponentView {
  initialize() {
    this.todo = new Todo();
    this.listenTo(this.todo, 'change:title', this.render);
  }

  setState({ onInput }) {
    this.onInput = onInput;
  }

  @debounce(300)
  inputChange(event) {
    let title = event.target.value.trim();
    if (title) {
      this.todo.title = title;
    }
  }

  onEnter(event) {
    let title = this.todo.title;
    if (title && event.which === ENTER_KEY) {
      this.todo.title = '';
      this.onInput(title);
    }
  }
}