import {component, event, props, defaults} from 'Lib/backbone-decorators'
import ComponentView      from 'Components/ComponentView'
import Backbone           from 'backbone'
import template           from 'Templates/todos-app.hbs'

import TodosHeader from 'Components/TodosHeader'
import TodosList   from 'Components/TodosList'
import TodosFooter from 'Components/TodosFooter'

import Todo            from 'Models/Todo'
import TodosCollection from 'Models/TodosCollection'

@component({
  tagName:  'todos-app',
  template: template
})
export default class TodosApp extends ComponentView {
  initialize() {
    this.todosList = new TodosCollection();
    this.listenTo(this.todosList, "add remove", this.render);
  }

  createTodo(title) {
    this.todosList.add({ title });
  }

  getState() {
    return {
      list:       this.todosList.toJSON(),
      createTodo: _.bind(this.createTodo, this)
    };
  }
}


