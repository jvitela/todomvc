import {component, route} from 'Lib/backbone-decorators'
import ViewModel       from 'Components/ViewModel'
import template        from 'Templates/todos-app.hbs'
import TodosCollection from 'Models/TodosCollection'
import Backbone        from 'backbone'

const STORAGE_ID = 'TODOSMVC';

@component({
  tagName:  'todos-app',
  template: template
})
export default class TodosApp extends ViewModel {
  initialize() {
    this.order  = 0;
    this.filter = new Backbone.Model();
    this.todos  = new TodosCollection();

    this.todos.initLocalStorage(STORAGE_ID);
    if (this.todos.length) {
      this.order = this.todos.maxOrder;
    }

    this.configureRouter();
    this.listenTo(this.todos,  'add remove change', this.render);
    this.listenTo(this.filter, 'change', this.render);
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
    this.todos.clearCompleted();
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

  toggleAllCompleted(completed) {
    this.todos.invoke('set', 'completed', completed);
  }

  /**
   * Filters the list of todos
   * @return TodosCollection containing the filtered items.
   */
  get visibleTodos() {
    let query = this.filter.toJSON();
    let list  = this.todos.where(query);
    return list; // return Array of Todos
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
