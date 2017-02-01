import {props, debounce} from 'Lib/backbone-decorators'
import Backbone from 'backbone'
import Todo     from 'Models/Todo'

@props({
  model:       Todo,
  comparator: 'order'
})
export default class TodosCollection extends Backbone.Collection {
  initialize() {
    this.listenTo(this, 'change:editing', this.toggleOthers);
  }

  initLocalStorage(storageId) {
    let todos = localStorage.getItem(storageId);
    todos && this.set(JSON.parse(todos));

    this.storageId = storageId;
    this.listenTo(this, 'add remove change:title change:completed', this.saveToLocalStorage);
  }

  clearCompleted() {
    let completed = this.where({ completed:true });
    this.remove(completed);
  }

  get maxOrder() {
    return Math.max.apply(null, this.pluck('order'));
  }

  toggleOthers(todo) {
    if (!todo.editing) {
      return;
    }
    let todos = this.reject(todo);
    todos.forEach((t) => { t.editing = false; });
  }

  @debounce(100)
  saveToLocalStorage() {
    let data = this.toJSON();
    data.forEach((t) => { t.editing = false; });
    localStorage.setItem(this.storageId, JSON.stringify(data));
  }
}