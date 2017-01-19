import {component, event} from 'Lib/backbone-decorators'
import ComponentView      from 'Components/ComponentView'
import template           from 'Templates/todos-list.hbs'

import TodosCollection    from 'Models/TodosCollection'

@component({
  tagName:  'todos-list',
  template: template
})
export default class TodosList extends ComponentView {
  setState({ todos }) {
    this.todos = todos;
    this.listenTo(this.todos, "add remove", this.render);
  }

  getState() {
    let todos = this.todos.toJSON();
    return { todos };
  }
}