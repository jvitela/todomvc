import {component, event, props, defaults} from 'Lib/backbone-decorators'
import ComponentView      from 'Components/ComponentView'
import _                  from 'underscore'
import Backbone           from 'backbone'
import template           from 'Templates/todos-app.hbs'

import TodosHeader from 'Components/TodosHeader'
import TodosList   from 'Components/TodosList'
import TodosFooter from 'Components/TodosFooter'

// import Todo            from 'Models/Todo'
import TodosCollection from 'Models/TodosCollection'

@component({
  tagName:  'todos-app',
  template: template
})
export default class TodosApp extends ComponentView {
  initialize() {
    this.order = 0;
    this.todosList = new TodosCollection();
    this.listenTo(this.todosList, "add remove", this.render);
  }

  createTodo(title) {
    let order = ++this.order;
    this.todosList.add({ title, order });
  }

  removeTodo(todo) {
    this.todosList.remove(todo);
  }

  // getState() {
  //   return {
  //     list:       this.todosList,
  //     createTodo: (title) => this.createTodo(title),
  //     removeTodo: (todo)  => this.removeTodo(todo),
  //   };
  // }
}


