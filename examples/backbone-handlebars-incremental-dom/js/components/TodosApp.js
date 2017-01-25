import {component, route} from 'Lib/backbone-decorators'
import ComponentView   from 'Components/ComponentView'
import template        from 'Templates/todos-app.hbs'
import TodosHeader     from 'Components/TodosHeader'
import TodosList       from 'Components/TodosList'
import TodosFooter     from 'Components/TodosFooter'
import TodosCollection from 'Models/TodosCollection'
import Backbone        from 'backbone'

@component({
  tagName:  'todos-app',
  template: template
})
export default class TodosApp extends ComponentView {
  initialize() {
    this.order  = 0;
    this.filter = new Backbone.Model();
    this.todos  = new TodosCollection();

    this.configureRouter();
    this.listenTo(this.todos,  "add remove change", this.render);
    this.listenTo(this.filter, "change", this.render);
  }

  createTodo(title) {
    let order = ++this.order;
    this.todos.add({ title, order });
  }

  removeTodo(todo) {
    this.todos.remove(todo);
  }

  toggleCompleted(todo) {
    todo.toggleCompleted();
  }

  toggleEditing(todo) {
    todo.toggleEditing();
  }

  clearCompleted() {
    let completed = this.todos.where({ completed:true });
    this.todos.remove(completed);
  }

  editTitle(todo, title) {
    title = title.trim();
    if (!title) {
      this.removeTodo(todo);
      return;
    }
    todo.set({
      title:   title,
      editing: false
    });    
  }

  /**
   * Filters the list of todos
   * @return TodosCollection containing the filtered items.
   */
  get visibleTodos() {
    let query = this.filter.toJSON();
    let list  = this.todos.where(query);
    return new TodosCollection(list);
  }

  @route('active')
  showActive() {
    this.filter.set('completed', false);
  }

  @route('completed')
  showCompleted() {
    this.filter.set('completed', true);
  }

  @route('*default')
  showAll() {
    this.filter.clear();
  }
}
