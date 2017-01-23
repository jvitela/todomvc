import {component, event} from 'Lib/backbone-decorators'
import ComponentView      from 'Components/ComponentView'
import template           from 'Templates/todos-header.hbs'
import Todo               from 'Models/Todo'

const ENTER_KEY = 13;
const ESC_KEY   = 27;

@component({
  tagName:  'todos-header',
  template: template
})
export default class TodosHeader extends ComponentView {
  initialize() {
    this.todo = new Todo();
    this.listenTo(this.todo, "change", this.render);
  }

  // @event('input .new-todo')
  inputChange(event) {
    let title = event.currentTarget.value.trim();
    title && this.todo.set({ title });
  }

  // @event('keypress .new-todo')
  onEnter(event) {
    let title = this.todo.get("title");
    if (title && event.which === ENTER_KEY) {
      this.onInput(title);
      this.todo.reset();
    }
  }

  setState({ oninput }) {
    this.onInput = oninput;
  }

  // getState() {
  //   return this.todo.toJSON();
  // }
}