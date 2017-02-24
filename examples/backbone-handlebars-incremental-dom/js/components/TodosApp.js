import {component, bindable, route} from 'Lib/backbone-decorators'
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

  @bindable()
  createTodo(title) {
    let order = ++this.order;
    this.todos.add({ title, order });
  }

  @bindable()
  removeTodo(todo) {
    this.todos.remove(todo);
  }

  @bindable()
  toggleCompleted(todo) {
    todo.toggleCompleted();
  }

  @bindable()
  toggleEditing(todo, value) {
    todo.editing = !!value;
  }

  @bindable()
  clearCompleted() {
    this.todos.clearCompleted();
  }

  @bindable()
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

  @bindable()
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

  /**
   * @return boolean True if the list contains items and all are completed
   */
  get allCompleted() {
    let pending = this.todos.findWhere({ completed: false });
    return this.todos.length && !pending;
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
