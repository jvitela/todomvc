import {props}  from 'Lib/backbone-decorators'
import Backbone from 'backbone'
import Todo     from 'Models/Todo'

@props({
  model:       Todo,
  comparator: 'order'
})
export default class TodosCollection extends Backbone.Collection {
  clearCompleted() {
    let completed = this.where({ completed:true });
    this.remove(completed);
  }
}