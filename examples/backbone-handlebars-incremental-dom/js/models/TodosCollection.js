import {props, debounce} from 'Lib/backbone-decorators'
import Backbone from 'backbone'
import Todo     from 'Models/Todo'

@props({
  model:       Todo,
  comparator: 'order'
})
export default class TodosCollection extends Backbone.Collection {
  
  initLocalStorage(storageId) {
    let todos = localStorage.getItem(storageId);
    todos && this.set(JSON.parse(todos));

    this.storageId = storageId;
    this.listenTo(this, "add remove change:title change:completed", this.saveToLocalStorage);
  }

  clearCompleted() {
    let completed = this.where({ completed:true });
    this.remove(completed);
  }

  toggleEditing(todo) {
    let todos = todo ? this.reject(todo) : this.models;
    todos.forEach((t) => { t.editing = false; });
    todo && todo.toggleEditing();
  }

  get maxOrder() {
    return Math.max.apply(null, this.pluck('order'));
  }

  @debounce(100)
  saveToLocalStorage() {
    let data = this.toJSON();
    data.forEach((t) => { t.editing = false; });
    localStorage.setItem(this.storageId, JSON.stringify(data));
  }
}