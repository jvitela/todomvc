import {component, event} from 'Lib/backbone-decorators'
import ComponentView      from 'Components/ComponentView'
import template           from 'Templates/todos-list.hbs'

import TodosCollection    from 'Models/TodosCollection'

@component({
  tagName:  'todos-list',
  template: template
})
export default class TodosList extends ComponentView {
  initialize() {
    this.todos = new TodosCollection();
    this.listenTo(this.todos, "add remove", this.render);
  }

  setState({ todos }) {
    this.todos.set(todos);
  }

  getState() {
    let todos = this.todos.toJSON();
    console.log(this.todos);
    return { todos };
  }
}