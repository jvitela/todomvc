import {props}  from 'Lib/backbone-decorators'
import Backbone from 'backbone'

@props({
  idAttribute: 'order',
  defaults : {
    title:     '',
    order:     0,
    editing:   false,
    completed: false
  }
})
export default class Todo extends Backbone.Model {
  toggleCompleted() {
    this.completed = !this.completed;
  }
}
