import {props}  from 'Lib/backbone-decorators'
import Backbone from 'backbone'

@props({
	idAttribute: 'order',
	defaults : {
	  title: 	   '',
	  order:     0,
	  editing:   false,
	  completed: false
	}
})
export default class Todo extends Backbone.Model {
  toggleEditing() {
  	// this.set({ editing: !this.get('editing') });
    this.editing = !this.editing;
  }
  toggleCompleted() {
  	// this.set({ completed: !this.get('completed') });
    this.completed = !this.completed;
  }
}
